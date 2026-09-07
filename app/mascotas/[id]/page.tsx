"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getPets } from "@/lib/services/pets";
import type { Pet } from "@/types/pet";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import VaccineManager from "@/components/pets/VaccineManager";
import AppointmentManager from "@/components/pets/AppointmentManager";

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [pet, setPet] = useState<Pet>();
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, async (u) => {
    if (!u) { router.replace("/login"); return; }
    try { setPet((await getPets(u.uid)).find((p) => p.id === id)); } finally { setLoading(false); }
  }), [id, router]);

  if (loading) return <main className="container-page py-16">Cargando ficha...</main>;
  if (!pet) return <main className="container-page py-16"><p>No encontramos esta mascota.</p><Link className="btn btn-primary mt-4" href="/dashboard">Volver al dashboard</Link></main>;

  return <main className="container-page max-w-5xl py-8">
    <Link href="/dashboard" className="text-sm font-bold text-[#5f7f61]">← Mis mascotas</Link>
    <div className="card mt-5 overflow-hidden">
      <div className="grid md:grid-cols-[280px_1fr]">
        <div className="h-72 bg-[#edf1eb]">{pet.photoUrl ? <img src={pet.photoUrl} alt={pet.name} className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center text-8xl">🐾</div>}</div>
        <div className="p-7"><div className="flex justify-between gap-4"><div><p className="text-sm font-bold text-[#5f7f61]">{pet.species}</p><h1 className="text-4xl font-black">{pet.name}</h1></div><Link href={`/mascotas/${pet.id}/editar`} className="btn btn-secondary"><Pencil size={16}/>Editar</Link></div><div className="mt-8 grid gap-5 sm:grid-cols-2"><div><span className="text-xs text-gray-500">Raza</span><p className="font-bold">{pet.breed || "No registrada"}</p></div><div><span className="text-xs text-gray-500">Sexo</span><p className="font-bold">{pet.gender}</p></div><div><span className="text-xs text-gray-500">Nacimiento</span><p className="font-bold">{pet.birthDate}</p></div><div><span className="text-xs text-gray-500">Peso</span><p className="font-bold">{pet.weight ? `${pet.weight} kg` : "No registrado"}</p></div></div><div className="mt-7"><span className="text-xs text-gray-500">Descripción</span><p className="mt-1 leading-7">{pet.description || "Sin información adicional."}</p></div></div>
      </div>
    </div>
    <section className="mt-8 grid gap-5 lg:grid-cols-2">
      <VaccineManager ownerId={pet.ownerId} petId={pet.id}/>
      <AppointmentManager ownerId={pet.ownerId} petId={pet.id} petName={pet.name}/>
    </section>
  </main>;
}
