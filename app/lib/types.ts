export type Lang = "en" | "zh" | "ar" | "vi";

export type Demographic =
  | ""
  | "International student"
  | "Elderly resident"
  | "New arrival"
  | "Local family";

export interface NearbyRequest {
  suburb: string;
  need: string;
  demographic: Demographic;
  lang: Lang;
}

export interface NearbyService {
  name: string;
  category: string;
  address: string;
  hours: string;
  access: string;
  why: string;
  note?: string;
}

export interface NearbyResponse {
  intro: string;
  services: NearbyService[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface FollowUpRequest {
  suburb: string;
  need: string;
  demographic: string;
  lang: Lang;
  services: NearbyService[];
  history: ChatMessage[];
  question: string;
}

export interface FollowUpResponse {
  answer: string;
}

export interface CommunityGroup {
  id?: string;
  title: string;
  description: string;
  category: string;
  suburb: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  schedule: string;
  created_at?: string;
}
