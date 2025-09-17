import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

const expensesRef = collection(db, "expenses");

export const addExpense = async (expense) => {
  await addDoc(expensesRef, expense);
};

export const getExpenses = async () => {
  const snapshot = await getDocs(expensesRef);
  return snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() }));
};

export const deleteExpense = async (id) => {
  const docRef = doc(db, "expenses", id);
  await deleteDoc(docRef);
};

export const listenToExpenses = (callback) => {
  return onSnapshot(expensesRef, (snapshot) => {
    const expenses = snapshot.docs.map((docu) => ({
      id: docu.id,
      ...docu.data(),
    }));
    callback(expenses);
  });
};
