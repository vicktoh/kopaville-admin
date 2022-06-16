import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Comment } from "../types/Post";
import { db } from "./firebase";
export const listenOnComment = (
  postId: string,
  onSuccess: (data: Comment[]) => void
) => {
  const commentQuery = query(
    collection(db, "comments"),
    where("postId", "==", postId)
  );
  onSnapshot(commentQuery, (snapshot) => {
    const comments: Comment[] = [];
    snapshot.forEach((snap) => {
      const data = snap.data() as Comment;
      data.objectID = snap.id;
      data.id = snap.id;
      comments.push(data);
    });
    onSuccess(comments);
  });
};

export const deleteComment = (commentId: string) => {
  const commentRef = doc(db, `comments/${commentId}`);
  return deleteDoc(commentRef);
};
