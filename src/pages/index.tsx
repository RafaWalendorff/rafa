import {
  createItemFirestore,
  deleteItemFirestore,
  fetchFromFirestore,
} from "@/lib/firebase";
import { Item } from "@/types/firebase.types";
import { useEffect, useState } from "react";

const collectionName = "lista";

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
    const lista = await fetchFromFirestore(collectionName);
    setValores(lista);
  };

  const postItem = async (props: { name: string; price: number }) => {
    await createItemFirestore({ ...props, collectionName });

    fetchList();
  };

  const deleteItem = async (id: string) => {
    await deleteItemFirestore({ id, collectionName });
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
