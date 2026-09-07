"use client";
import { useEffect, useState } from "react";
import { Trash2, Syringe } from "lucide-react";
import type { Vaccine } from "@/types/pet";
import { createVaccine, deleteVaccine, getVaccines } from "@/lib/services/vaccines";

export default function VaccineManager({ ownerId, petId }: { ownerId: string; petId: string }) {
  const [items, setItems] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", date: "", nextDate: "", notes: "" });

async function load() {
  try {
    setLoading(true);
    setError("");

    const vaccines = await getVaccines(ownerId, petId);

    console.log("VACUNAS RECIBIDAS:", vaccines);

    setItems(vaccines);
  } catch (error) {
    console.error("ERROR CARGANDO VACUNAS:", error);

    setError(
      error instanceof Error
        ? error.message
        : "No se pudo cargar el historial de vacunas."
    );
  } finally {
    setLoading(false);
  }
}
  useEffect(() => { load(); }, [ownerId, petId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!form.name || !form.date) { setError("Indica el nombre y la fecha de la vacuna."); return; }
    setSaving(true);
    try {
      await createVaccine(ownerId, petId, form);
      setForm({ name: "", date: "", nextDate: "", notes: "" });
      await load();
    } catch { setError("No se pudo guardar la vacuna."); } finally { setSaving(false); }
  }

  async function remove(item: Vaccine) {
    if (!confirm(`¿Eliminar el registro de ${item.name}?`)) return;
    await deleteVaccine(item.id); setItems((current) => current.filter((x) => x.id !== item.id));
  }

  return <div className="card p-6">
    <div className="flex items-center gap-3"><div className="rounded-xl bg-[#edf4ed] p-2 text-[#5f7f61]"><Syringe size={20}/></div><div><h2 className="text-xl font-black">Vacunas</h2><p className="text-sm text-gray-500">Historial y próxima dosis.</p></div></div>
    <form onSubmit={submit} className="mt-5 grid gap-3">
      <input className="input" placeholder="Nombre de la vacuna *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
      <div className="grid gap-3 sm:grid-cols-2"><div><label className="label">Fecha aplicada *</label><input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}/></div><div><label className="label">Próxima dosis</label><input className="input" type="date" value={form.nextDate} onChange={(e) => setForm({ ...form, nextDate: e.target.value })}/></div></div>
      <textarea className="input" placeholder="Notas" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}/>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button className="btn btn-primary" disabled={saving}>{saving ? "Guardando..." : "+ Registrar vacuna"}</button>
    </form>
    <div className="mt-6 space-y-3">
      {loading ? <p className="text-sm text-gray-500">Cargando...</p> : items.length === 0 ? <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">No hay vacunas registradas.</p> : items.map((item) => <div key={item.id} className="flex items-start justify-between gap-3 rounded-xl border border-[#e4e7e1] p-4"><div><p className="font-bold">{item.name}</p><p className="text-sm text-gray-500">Aplicada: {item.date}{item.nextDate ? ` · Próxima: ${item.nextDate}` : ""}</p>{item.notes && <p className="mt-1 text-sm">{item.notes}</p>}</div><button className="rounded-lg p-2 text-red-600 hover:bg-red-50" onClick={() => remove(item)} aria-label="Eliminar vacuna"><Trash2 size={17}/></button></div>)}
    </div>
  </div>;
}
