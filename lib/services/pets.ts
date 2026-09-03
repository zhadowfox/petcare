import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Pet } from "@/types/pet";
import CommonJSModulePlugin from "next/dist/build/babel/plugins/commonjs";
const ref = collection(db, "pets");
export async function getPets(ownerId: string) {
  const q = query(
    ref,
    where("ownerId", "==", ownerId),
    orderBy("createdAt", "desc"),
  );
  console.log("entra")
  console.log(q)
  try {
  const s = await getDocs(q);
  console.log("despues de getDocs")
  console.log(s)
  return s.docs.map((d) => ({ id: d.id, ...d.data() }) as Pet);

  } catch (error) {
    console.error("Error fetching pets:", error);
    throw error;
  }

}
export async function createPet(
  ownerId: string,
  data: Omit<Pet, "id" | "ownerId">,
) {
  return addDoc(ref, {
    ...data,
    ownerId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
export async function updatePet(
  id: string,
  data: Partial<Omit<Pet, "id" | "ownerId">>,
) {
  return updateDoc(doc(db, "pets", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
export async function deletePet(id: string) {
  return deleteDoc(doc(db, "pets", id));
}
