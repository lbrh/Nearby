# Nearby — Melbourne Community Connector

> **"Nobody. Can. Find. Stuff."**
>
> Everything we connected already existed. We just built the bridge.

Nearby is an AI-powered web app that helps City of Melbourne residents find local community services — food relief, libraries, community gardens, repair cafés, settlement support, and more — in plain language, in their own language.

Built at the **Southern Hemisphere's first Claude Impact Lab** (Melbourne, May 2026), placing **3rd overall**.

---

## The Problem

Melbourne has hundreds of community services, programs, and events. The problem isn't availability — it's discoverability. A newly arrived migrant, an elderly resident, or an international student in Carlton has no single place to ask: *"I need X, what's near me?"* Council websites are siloed, search engines surface irrelevant results, and word-of-mouth only goes so far.

## What Nearby Does

1. **You type your suburb and what you need** — in any language, as naturally as you'd tell a friend.
2. **Claude finds the three best-matching local services** — with real addresses, hours, and access instructions.
3. **Follow-up chat lets you dig deeper** — ask about eligibility, transport, whether they take walk-ins.
4. **A map pins every result** — so you can see what's actually close.
5. **Anyone can add events** — authenticated users submit community events that show up for others.
6. **All multilingual** — English, 普通话, العربية, Tiếng Việt, Bahasa Indonesia. The UI auto-translates and the results come back in the user's language.

---

## Architecture

```
Browser (Next.js React)
  │
  ├── /api/nearby          → Claude Sonnet: matches suburb + need → 3 services (JSON)
  ├── /api/nearby/followup → Claude Sonnet: multi-turn chat about those services
  ├── /api/services        → Reads cached suburb services from Supabase
  ├── /api/services/refresh→ Claude Sonnet: generates 8–14 suburb services → upserts to Supabase
  ├── /api/translate       → Claude Haiku: translates UI copy → caches in Supabase
  ├── /api/groups          → CRUD for community groups (Supabase)
  └── Supabase Auth        → Magic link / OAuth for event submission
```

### Data flow

```
User search
    │
    ▼
/api/nearby ──► Claude Sonnet (system prompt with CoM service knowledge)
    │               └── Returns: intro + 3 services with address/hours/access/why
    ▼
Results screen
    │
    ├──► Map (Leaflet geocoding)
    └──► Follow-up chat ──► /api/nearby/followup ──► Claude Sonnet (conversation history)

Background (lazy):
/api/services ──► checks Supabase for suburb cache
    │               └── if stale (>7 days): fires /api/services/refresh
    ▼               └── /api/services/refresh ──► Claude Sonnet ──► upserts to Supabase
Cached suburb services (used for Open Now filtering)
```

### Database (Supabase / PostgreSQL)

| Table | Purpose |
|-------|---------|
| `location_services` | Cached services per suburb (name, category, address, structured hours) |
| `location_fetches` | Tracks when each suburb was last refreshed |
| `community_groups` | User-submitted community groups |
| `events` | User-submitted events (RLS: public read, auth write) |
| `translations` | Cached UI copy translations keyed by language name |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), React 19 |
| AI | Claude Sonnet 4.6 (search + chat), Claude Haiku 4.5 (translations) |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Maps | Leaflet + React-Leaflet |
| Styling | Tailwind CSS 4 |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone and install

```bash
git clone https://github.com/your-org/nearby.git
cd nearby
npm install
```

### 2. Environment variables

Create a `.env.local` file:

```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Database setup

Run the migrations in your Supabase SQL editor in order:

```bash
supabase/migrations/002_events.sql
supabase/migrations/20260523000000_create_translations.sql
```

You also need the `location_services`, `location_fetches`, and `community_groups` tables. See the full schema in `supabase/migrations/`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How the AI Works

### Service search (`/api/nearby`)

The system prompt embeds a curated knowledge base of City of Melbourne services (community gardens, food relief, libraries, repair cafés, council grants, settlement support). When a user submits their suburb and need, Claude is instructed to:

- Pick exactly 3 services that best match the stated need
- Use only real addresses and hours it's confident about
- Omit website URLs it can't verify
- Add a `note` field when it has low confidence
- Respond in the user's language

### Suburb service cache (`/api/services/refresh`)

A separate prompt asks Claude to enumerate 8–14 real services with structured hours (as `{ days: number[], opens: "HH:MM", closes: "HH:MM" }`) for a given suburb. These are upserted into Supabase and reused for the "Open Now" filter without hitting the API again for 7 days.

### Translation (`/api/translate`)

UI copy strings are translated on-demand using Claude Haiku (fast and cheap), then persisted in Supabase. Subsequent users of the same language get the cached version instantly.

---

## Known Issues

These are bugs and limitations identified during the hackathon that a production version would need to address.

### Incomplete suburb list

[`app/lib/suburbs.ts`](app/lib/suburbs.ts) contains a manually curated list used for autocomplete. It covers most of inner and mid Melbourne but is missing a number of suburbs — particularly outer eastern, outer northern, and growth-corridor suburbs (Berwick, Pakenham, Frankston, Rowville, Werribee, and others). If a user types a suburb not in the list, autocomplete won't surface it; they can still type it free-form, but the experience degrades. The fix is to replace the static list with a complete dataset — the [VIC suburb/locality boundaries dataset](https://data.vic.gov.au) or the Australia Post postcode database are good sources.

Also note the list uses full spellings like `"Saint Kilda"` where residents typically type `"St Kilda"` — these mismatches should be normalised.

### "Open right now" feed not reliably triggering

The `OpenNow` component ([`app/components/OpenNow.tsx`](app/components/OpenNow.tsx)) has two compounding issues:

1. **Cold suburb cache.** Services are generated by Claude and stored in Supabase the first time a suburb is looked up (`/api/services/refresh`). This refresh fires as a background fire-and-forget request, so on first visit there is no cached data yet and the section stays invisible. There's no loading state or fallback — it just silently renders nothing.

2. **AI-generated structured hours are unreliable.** The `hours_structured` field (an array of `{ days, opens, closes }` objects) is generated by Claude and frequently comes back empty, malformed, or simply wrong. If the structured hours are empty, `isOpenNow()` returns false for every service, so the entire section is suppressed even when services are physically open.

The component also renders nothing (`return null`) when `openNow.length === 0`, meaning users who would benefit most from the feature never know it exists.

### User-submitted events don't appear in "Open right now"

User-submitted events (stored in the `events` Supabase table via `SubmitEventForm`) are displayed by the `UpcomingEvents` component on the landing page. However, `OpenNow` reads exclusively from `location_services` (the AI-generated services cache) — the two data sources are completely separate with no join.

This means:
- A community event added via "+ Add your own events" will appear in the *Upcoming events* list but never in the *Open right now* section, even if it's happening at this moment.
- The `UpcomingEvents` component also has a subtle query issue: the Supabase filter `.or('event_date.gte.${today},repeat_type.neq.none')` is intended to catch both future one-off events and any recurring events, but a recurring event whose base `event_date` is in the past will appear regardless of whether the next occurrence is actually soon.

### Language translation is incomplete and inconsistent

The translation system works at two levels, and both have gaps:

1. **UI copy** — translated on-demand by Claude Haiku and cached in Supabase (`/api/translate`). This covers most labels and buttons, but several components have **hardcoded English strings that bypass the translation system entirely**: the "Today" / "Tomorrow" relative date labels in `UpcomingEvents`, the repeat badges ("Daily", "Weekly", "Monthly", "Yearly"), the "until {time}" label in `OpenNow`, and the "Open right now" heading.

2. **Service results** — Claude Sonnet is instructed to respond in the user's selected language. In practice the quality varies: Arabic and Vietnamese results are sometimes mixed with English fragments; the `category` field (used as a UI tag) comes back in the target language but the rest of the app renders category strings in English elsewhere, causing a mismatch.

Language detection from free-text input (`detect-lang.ts`) only covers the five supported languages and can misfire on short or ambiguous inputs, unexpectedly switching the UI mid-session.

---

## Roadmap — Path to Production

The prototype works, but leans on Claude for data that should live in a structured database. Here's what a production version needs:

### 1. Replace Claude-as-database with real data ingestion

**The problem:** Claude generates plausible service data from its training knowledge. It can hallucinate hours, addresses, or services that have closed.

**The solution:**

| Source | What to pull |
|--------|-------------|
| [City of Melbourne Open Data](https://data.melbourne.vic.gov.au) | Libraries, community centres, gardens, pools — real addresses + hours |
| [data.vic.gov.au](https://www.data.vic.gov.au) | State-level community services |
| [Ask Izzy / Infoxchange API](https://askizzy.org.au) | Food relief, crisis services, settlement support — already structured |
| [Eventbrite API](https://www.eventbrite.com/platform/api) | Community events by location |
| [Meetup API](https://www.meetup.com/api/guide/) | Local group events |
| Council website scrapers | For services with no public API (use a scheduled scraper + LLM extraction) |

A weekly ETL pipeline (e.g. a Supabase Edge Function on a cron) would fetch, normalise, and upsert this data. Claude's role shifts from *inventing* data to *interpreting* it — answering questions about data that's actually verified.

### 2. Vector search for semantic service matching

**The problem:** The current approach prompts Claude with a hardcoded list of known services. It doesn't scale beyond the ~50 services in the system prompt.

**The solution:** Store service embeddings in [pgvector](https://github.com/pgvector/pgvector) (available natively in Supabase):

```sql
-- Add to location_services
ALTER TABLE location_services ADD COLUMN embedding vector(1536);

-- Semantic search
SELECT name, address, category,
       1 - (embedding <=> query_embedding) AS similarity
FROM location_services
ORDER BY embedding <=> query_embedding
LIMIT 10;
```

Workflow:
1. When a service is ingested, generate an embedding from its `name + description + category` using the Anthropic Embeddings API (or `text-embedding-3-small` from OpenAI)
2. At query time, embed the user's `need` string
3. Retrieve the top-K semantically similar services
4. Pass only those K services to Claude for ranking and explanation — not the entire database

This makes the system scalable to thousands of services while keeping Claude's context window small.

### 3. Structured hours + real-time "Open Now"

The current `hours_structured` field is Claude-generated and unreliable. With real data sources, replace it with a proper normalised hours schema and compute open/closed status server-side rather than trusting generated JSON.

### 4. Geolocation + distance ranking

Add a `coordinates` column (PostGIS `geography(Point)`) to `location_services` and sort results by distance from the user's detected or entered location. Supabase supports PostGIS natively.

### 5. Expand beyond Melbourne

The system prompt and service knowledge are Melbourne-specific. The suburb → service lookup pattern generalises to any city. A production version would:
- Replace the hardcoded CoM knowledge with data-driven service lookups per city
- Let councils or community orgs self-manage their listings via an admin interface

### 6. Authentication and event moderation

Currently any authenticated user can submit events without review. Add:
- An admin review queue before events go public
- Spam/abuse detection (another good Claude use case)
- Organisation accounts so service providers can manage their own listings

### 7. Replace Claude with a dedicated translation service

Using Claude Haiku for UI copy translation works as a prototype but is the wrong tool for this job in production.

**Problems with the current approach:**
- Claude is non-deterministic — the same string can translate differently across calls, causing inconsistent UI
- Haiku's translation quality is noticeably lower than specialist models for some languages, particularly Arabic script rendering and Vietnamese tones
- Hardcoded strings in components (see Known Issues above) are never translated at all
- Latency on cache miss is ~1–2s, which users notice on first language switch

**Better approach:** Use a purpose-built translation API:

| Service | Notes |
|---------|-------|
| [DeepL API](https://www.deepl.com/pro-api) | Best quality for European languages; limited Asian language support |
| [Google Cloud Translation](https://cloud.google.com/translate) | Broadest language coverage, strong for Vietnamese and Bahasa Indonesia |
| [Azure AI Translator](https://azure.microsoft.com/en-au/products/ai-services/ai-translator) | Good Arabic support, competitive pricing |

The pattern would be the same — translate once, cache in Supabase — but swap the Anthropic API call for a deterministic translation API call. Claude's role is better reserved for the nuanced, context-aware parts of the app (service matching and follow-up chat) where its reasoning adds real value.

Also worth implementing: a **static base translation file** for the five supported languages that ships with the app, so the UI is never in English while waiting for an API response. Claude or a translation service populates it at build time; runtime calls only handle dynamic or new strings.

### 8. Analytics and feedback

Add thumbs up/down on service results and track which services get clicked or followed up. Feed this signal back into ranking — Claude's top pick isn't always the most useful one.

---

## Team

| Name | Role |
|------|------|
| Purvang | CEO |
| Liam | CTO |
| Malisha | CCO |
| Zhafira | CMO |

Built at the **Melbourne Claude Impact Lab**, May 2026.

---

## Contributing

Pull requests welcome. For significant changes, open an issue first to discuss what you'd like to change.

## License

MIT
