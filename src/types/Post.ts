import { Timestamp } from "firebase/firestore";

export interface Post {
  dateCreated: Timestamp | number;
  mediaType: "Video" | "Image" | "None";
  creatorId: string;
  likes: number;
  comments: number;
  imageUrl?: string[];
  videoUrl?: string;
  caption?: string;
  postId?: string;
  text?: string;
  avartar: {
    photoUrl?: string;
    username: string;
  };
  objectID: string;
}

export type Comment = {
  id?: string;
  date: Timestamp | number;
  userId: string;
  postId: string;
  photoUrl: string;
  comment: string;
  fullname: string;
  username: string;
  objectID: string;
};
