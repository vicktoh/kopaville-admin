import { Timestamp } from "firebase/firestore";


export interface Post {
   dateCreated: Timestamp;
   mediaType: 'Video'| 'Image' | 'None',
   creatorId: string;
   likes: number;
   comments: number;
   imageUrl?: string [];
   videoUrl?: string;
   caption?: string;
   postId?: string;
   text?: string;
   avartar: {
       photoUrl?: string;
       username: string;
   }

}