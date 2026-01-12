
export interface UserProfile {
  location: string;
  interests: string;
  experience: string;
  skills: string[];
}

export interface Recommendation {
  careerName: string;
  description: string;
  whyFits: string;
  planteles: string[];
  links: string[];
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
}

export enum AppState {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS'
}
