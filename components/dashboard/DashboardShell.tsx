"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { deletePet, getPets } from "@/lib/services/pets";
import type { Pet } from "@/types/pet";
import PetCard from "@/components/pets/PetCard";
import { getVaccines } from "@/lib/services/vaccines";
export default function DashboardShell() {
  
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        if (!u) {
          router.replace("/login");
          return;
        }
        setUser(u);
        console.log(u.uid);
        try {
          setPets(await getPets(u.uid));
          
        } catch {
          setError(
            "No se pudieron cargar tus mascotas. Revisa la configuración de Firestore.",
          );
        } finally {
          setLoading(false);
        }
      }),
    [router],
  );
  async function remove(p: Pet) {
    if (!confirm(`¿Eliminar a ${p.name}? Esta acción no se puede deshacer.`))
      return;
    try {
      await deletePet(p.id);
      setPets((x) => x.filter((i) => i.id !== p.id));
    } catch {
      alert("No se pudo eliminar la mascota.");
    }
  }
  if (loading)
    return <main className="container-page py-16">Cargando tu espacio...</main>;
  return (
    <main className="container-page py-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Bienvenido</p>
          <h1 className="text-3xl font-black">
            {user?.displayName || user?.email}
          </h1>
          <p className="mt-1 text-gray-500">
            Administra la información de tus compañeros.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/mascotas/nueva" className="btn btn-primary">
            + Agregar mascota
          </Link>
          <button className="btn btn-secondary" onClick={() => signOut(auth)}>
            Salir
          </button>
        </div>
      </header>
      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-gray-500">Mascotas</p>
          <strong className="text-3xl">{pets.length}</strong>
        </div>
    
      </section>
      <h2 className="mb-4 text-2xl font-black">Mis mascotas</h2>
      {pets.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-5xl">🐾</div>
          <h3 className="mt-4 text-xl font-black">Aún no tienes mascotas</h3>
          <p className="mt-2 text-gray-500">Agrega la primera para comenzar.</p>
          <Link href="/mascotas/nueva" className="btn btn-primary mt-5">
            Agregar mi primera mascota
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((p) => (
            <PetCard key={p.id} pet={p} onDelete={remove} />
          ))}
        </div>
      )}
    </main>
  );
}
