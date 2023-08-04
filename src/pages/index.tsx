import { useEffect, useState } from "react";
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

type Item = {
  id: string;
  name: string;
  price: string;
};

export default function Home() {
  const [valores, setValores] = useState<Item[]>([]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const name = e.target.name.value;
    const price = e.target.price.value;
    postItem({
      name,
      price,
    });
  };

  const fetchList = async () => {
    const q = query(collection(db, "lista"));
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
    setValores(lista);
  };

  const postItem = async ({ name, price }: { name: string; price: number }) => {
    await addDoc(collection(db, "lista"), {
      name,
      price,
      createAt: new Date(),
    });

    fetchList();
  };

  const deleteItem = async (name: string) => {
    await deleteDoc(doc(db, "lista", name));
    fetchList();
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <main className="flex flex-col justify-center items-center h-screen overflow-hidden bg-orange-200">
      <form onSubmit={onSubmit} className="flex gap-4 mb-4">
        <input
          defaultValue={"Pneu"}
          name="name"
          type="text"
          placeholder="Digite seu nome"
        />
        <input
          defaultValue={"10.0"}
          name="price"
          type="number"
          placeholder="Valor"
        />

        <button type="submit">Adicionar</button>
      </form>

      {valores.map(({ id, name, price }) => (
        <div className="flex gap-4 mb-4" key={id}>
          <p>
            {name} - {price}
          </p>
          <button onClick={() => deleteItem(id)}>X</button>
        </div>
      ))}
    </main>
  );
}
