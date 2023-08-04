import { Item } from "@/types/firebase.types";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  collection,
  getDocs,
  query,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const fetchFromFirestore = async (
  collectionName: string
): Promise<Item[]> => {
  const q = query(collection(db, collectionName));
  const lista: Item[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    lista.push({
      id: doc.id,
      name: data.name,
      price: data.price,
    });
  });
  return lista;
};

export const createItemFirestore = async ({
  name,
  price,
  collectionName,
}: {
  name: string;
  price: number;
  collectionName: string;
}) => {
  await addDoc(collection(db, collectionName), {
    name,
    price,
    createAt: new Date(),
  });
};

export const deleteItemFirestore = async ({
  id,
  collectionName,
}: {
  id: string;
  collectionName: string;
}) => {
  await deleteDoc(doc(db, collectionName, id));
};
