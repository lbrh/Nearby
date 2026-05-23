import { headers } from "next/headers";
import NearbyApp from "./components/NearbyApp";
import { detectLangFromHeader } from "./lib/detect-lang";

export default async function Home() {
  const h = await headers();
  const initialLang = detectLangFromHeader(h.get("accept-language"));
  return <NearbyApp initialLang={initialLang} />;
}
