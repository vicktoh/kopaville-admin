import { Timestamp } from "firebase/firestore";
import { Post } from "./Post";
import { Profile } from "./Profile";

export type Report = {
  objectID: string;
  post: Post;
  reporter: {
    displayName: string;
    photoUrl: string;
    userName: string;
    userId: string;
  };
  date: Timestamp | number;
  reason: string;
  description?: string;
};

export type ReportedUser = {
  user: Profile;
  reporter: Report["reporter"];
  date: Timestamp | number;
  description?: string;
  reason: string;
  objectID: string;
};

export type HttpResponse = {
  status: "success" | "failed";
  message?: string;
};
