export type Topic = {
  id: string;
  title: string;
  userId?: string;
  userName?: string;
};

export type User = {
  id: string;
  name: string;
  vote?: boolean;
  weight?: number | null;
};

export type Vote = {
  voterId: string;
  topicId: string;
  rank: number;
};

export type TopicResult = Topic & {
  score: number;
};

export type TeamResult = {
  topic: TopicResult;
  members: User[];
  totalWeight: number;
};

export type AssignmentMetrics = {
  teamCount: number;
  averageWeight: number;
  weightVariance: number;
  averagePreferenceScore: number;
  preferenceVariance: number;
};
