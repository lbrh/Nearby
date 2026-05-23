export type Lang = "en" | "zh" | "ar" | "vi" | "id";

export type Demographic =
  | ""
  | "International student"
  | "Elderly resident"
  | "New arrival"
  | "Local family"
  | "Other";

export interface NearbyRequest {
  suburb: string;
  need: string;
  demographic: string;
  lang: string;
}

export interface NearbyService {
  name: string;
  category: string;
  address: string;
  hours: string;
  access: string;
  why: string;
  website?: string;
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
  lang: string;
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
