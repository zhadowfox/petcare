"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        const c = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(c.user, { displayName: name });
        await setDoc(doc(db, "users", c.user.uid), {
          name,
          email,
          createdAt: serverTimestamp(),
        });
      } else await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err?.code === "auth/invalid-credential"
          ? "Correo o contraseña incorrectos."
          : err?.code === "auth/email-already-in-use"
            ? "Ese correo ya está registrado."
            : err?.message || "No fue posible completar la operación.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={submit} className="card space-y-5 p-7">
      {mode === "register" && (
        <div>
          <label className="label">Nombre</label>
          <input
            required
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>
      )}
      <div>
        <label className="label">Correo electrónico</label>
        <input
          required
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label className="label">Contraseña</label>
        <input
          required
          minLength={6}
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
        />
      </div>
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <button disabled={loading} className="btn btn-primary w-full">
        {loading
          ? "Procesando..."
          : mode === "login"
            ? "Ingresar"
            : "Crear cuenta"}
      </button>
    </form>
  );
}
