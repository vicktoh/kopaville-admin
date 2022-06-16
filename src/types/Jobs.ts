import { Timestamp } from "firebase/firestore";

export interface Job {
  title: string;
  description: string;
  location: string;
  organisation: string;
  criteria: string[];
  link: string;
  dateAdded?: Timestamp;
}

export interface Business {
  name: string;
  address: string;
  instagram?: string;
  twitter?: string;
  link?: string;
  services?: string[];
  dateAdded?: Timestamp;
}

export type JobType = Job &
  Business & { objectID?: string; verified?: boolean };
