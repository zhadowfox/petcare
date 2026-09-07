"use client";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, Trash2 } from "lucide-react";
import type { Appointment } from "@/types/pet";
import { APPOINTMENT_SLOTS } from "@/types/pet";
import { getAuth } from "firebase/auth";
import { cancelAppointment, createAppointment, getAppointments, getBookedSlots, getAvailableSlotInfo, isValidAppointmentDate } from "@/lib/services/appointments";

function todayString() { return new Date().toLocaleDateString("en-CA"); }
function formatDate(date: string) { return new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(new Date(`${date}T12:00:00`)); }

export default function AppointmentManager({ ownerId, petId, petName }: { ownerId: string; petId: string; petName: string }) {
  const [date, setDate] = useState("");
  const [booked, setBooked] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reason, setReason] = useState("Consulta general");
  const [notes, setNotes] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
const auth = getAuth();

console.log("UID AUTH:", auth.currentUser?.uid);
console.log("OWNER ID:", ownerId);
  async function loadAppointments() {
    try { setAppointments(await getAppointments(ownerId, petId)); } catch { setError("No se pudieron cargar las citas."); }
  }
  useEffect(() => { loadAppointments(); }, [ownerId, petId]);

  useEffect(() => {
    if (!date) { setBooked([]); return; }
    if (!isValidAppointmentDate(date)) { setBooked([]); setSelectedTime(""); return; }
    setLoadingSlots(true); setError("");
    getBookedSlots(date).then(setBooked).catch(() => setError("No se pudo consultar la disponibilidad.")).finally(() => setLoadingSlots(false));
    setSelectedTime("");
  }, [date]);

  const slots = useMemo(() => getAvailableSlotInfo(date, booked), [date, booked]);
  const today = todayString();

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!date || !isValidAppointmentDate(date)) { setError("Selecciona un día válido de lunes a sábado."); return; }
    if (!selectedTime) { setError("Selecciona un horario disponible."); return; }
    if (date === today && selectedTime <= new Date().toTimeString().slice(0, 5)) { setError("Ese horario ya pasó. Selecciona otro."); return; }
    setSaving(true);
    try {
      await createAppointment(ownerId, { petId, date, time: selectedTime, reason, notes });
      setSelectedTime(""); setNotes("");
      await loadAppointments();
      setBooked(await getBookedSlots(date));
    } catch (err) { setError(err instanceof Error ? err.message : "No se pudo agendar la cita."); }
    finally { setSaving(false); }
  }

  async function remove(item: Appointment) {
    if (!confirm(`¿Cancelar la cita de ${formatDate(item.date)} a las ${item.time}?`)) return;
    try { await cancelAppointment(item.id, item.date, item.time, item.veterinarian); await loadAppointments(); if (date === item.date) setBooked(await getBookedSlots(date)); } catch { setError("No se pudo cancelar la cita."); }
  }

  return <div className="card p-6">
    <div className="flex items-center gap-3"><div className="rounded-xl bg-[#edf4ed] p-2 text-[#5f7f61]"><CalendarDays size={20}/></div><div><h2 className="text-xl font-black">Citas veterinarias</h2><p className="text-sm text-gray-500">Lunes a sábado · 7:00 a. m. a 6:00 p. m. · 1 hora.</p></div></div>
    <form onSubmit={submit} className="mt-5 space-y-4">
      <div><label className="label">Selecciona el día</label><input className="input" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)}/>{date && !isValidAppointmentDate(date) && <p className="mt-1 text-xs text-red-600">El domingo no está disponible.</p>}</div>
      {date && isValidAppointmentDate(date) && <div><div className="mb-2 flex items-center justify-between"><label className="label mb-0">Horarios disponibles</label>{loadingSlots && <span className="text-xs text-gray-500">Consultando...</span>}</div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3"><>{slots.map((slot) => { const past = date === today && slot.time <= new Date().toTimeString().slice(0, 5); const disabled = !slot.available || past; return <button key={slot.time} type="button" disabled={disabled} onClick={() => setSelectedTime(slot.time)} className={`rounded-xl border p-3 text-left ${selectedTime === slot.time ? "border-[#5f7f61] bg-[#edf4ed]" : "border-[#e4e7e1]"} ${disabled ? "cursor-not-allowed opacity-40" : "hover:border-[#5f7f61]"}`}><div className="flex items-center gap-2 font-bold"><Clock3 size={15}/>{slot.time}–{String(Number(slot.time.slice(0,2)) + 1).padStart(2,"0")}:00</div><p className="mt-1 text-xs text-gray-500">{past ? "Horario pasado" : slot.available ? slot.veterinarian : "Sin disponibilidad"}</p></button> })}</></div></div>}
      <div className="grid gap-3 sm:grid-cols-2"><div><label className="label">Motivo</label><select className="input" value={reason} onChange={(e) => setReason(e.target.value)}><option>Consulta general</option><option>Vacunación</option><option>Control</option><option>Desparasitación</option><option>Urgencia no crítica</option><option>Otro</option></select></div><div><label className="label">Mascota</label><input className="input bg-gray-50" value={petName} readOnly/></div></div>
      <textarea className="input" placeholder="Notas para el veterinario (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)}/>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button className="btn btn-primary w-full" disabled={saving}>{saving ? "Agendando..." : "Agendar cita"}</button>
    </form>
    <div className="mt-7"><h3 className="mb-3 font-black">Citas de {petName}</h3>{appointments.length === 0 ? <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">No hay citas agendadas.</p> : <div className="space-y-3">{appointments.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#e4e7e1] p-4"><div><p className="font-bold">{formatDate(item.date)} · {item.time}</p><p className="text-sm text-gray-500">{item.veterinarian} · {item.reason}</p></div><button className="rounded-lg p-2 text-red-600 hover:bg-red-50" onClick={() => remove(item)} aria-label="Cancelar cita"><Trash2 size={17}/></button></div>)}</div>}</div>
  </div>;
}
