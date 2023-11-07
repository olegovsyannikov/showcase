import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import app from "../firebaseClient";
import { QuizProgress } from "../types/firebaseTypes";

const db = getFirestore(app);

export const saveQuizProgress = async (
  userId: string,
  progressData: QuizProgress,
) => {
  const userRef = doc(collection(db, "quizProgress"), userId);
  await setDoc(userRef, progressData);
};

export const getQuizProgress = async (
  userId: string,
): Promise<QuizProgress | null> => {
  const userRef = doc(collection(db, "quizProgress"), userId);
  const docSnapshot = await getDoc(userRef);

  if (docSnapshot.exists()) {
    return docSnapshot.data() as QuizProgress;
  } else {
    return null;
  }
};
