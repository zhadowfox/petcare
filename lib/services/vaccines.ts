import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Vaccine } from "@/types/pet";

const ref = collection(db, "vaccines");

export async function getVaccines(ownerId: string, petId: string) {
  const q = query(ref, where("ownerId", "==", ownerId), where("petId", "==", petId), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Vaccine));
}

export async function createVaccine(ownerId: string, petId: string, data: Omit<Vaccine, "id" | "ownerId" | "petId" | "createdAt">) {
  return addDoc(ref, { ...data, ownerId, petId, createdAt: serverTimestamp() });
}

export async function deleteVaccine(id: string) {
  return deleteDoc(doc(db, "vaccines", id));
}
