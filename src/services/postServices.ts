import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { Post } from "../types/Post";
import { db } from "./firebase"



export const listenOnPost = (callback : (data:any)=>void) =>{
   const postCollectionRef = collection(db, "posts");
   const postQuery = query(postCollectionRef, orderBy('dateCreated', 'desc'), limit(100));

   return onSnapshot(postQuery, (querysnapshot)=> {
      const posts: Post[] = []
      querysnapshot.forEach((snap)=>{
         const post = snap.data() as Post;
         post.postId = snap.id;
         posts.push(post);
      })

      callback(posts);
   })
}