export interface Attachment {
  name: string;
  type: string; // 'image' | 'video' | 'file'
  url: string;  // Base64 or object URL
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number; // For 7-day deletion logic
  attachments?: Attachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number; // Important for 7 days deletion logic
  updatedAt: number;
}

export interface UserProfile {
  email: string;
  displayName: string;
  avatarUrl?: string;
  provider: "google" | "custom";
}

export interface DirectAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  tag: string;
}
