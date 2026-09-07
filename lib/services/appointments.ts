import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, runTransaction, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { APPOINTMENT_SLOTS, VETERINARIANS, type Appointment } from "@/types/pet";
import { getAvailableSlotInfo, isValidAppointmentDate } from "@/lib/services/appointmentRules";

export { getAvailableSlotInfo, isValidAppointmentDate } from "@/lib/services/appointmentRules";

const appointmentsRef = collection(db, "appointments");
const slotsRef = collection(db, "appointmentSlots");

export function getAppointmentSlots() {
  return [...APPOINTMENT_SLOTS];
}

function slotId(date: string, time: string, veterinarianId: string) {
  return `${date}_${time.replace(":", "")}_${veterinarianId}`;
}

export async function getAppointments(ownerId: string, petId?: string) {
  const constraints = [where("ownerId", "==", ownerId)];
  if (petId) constraints.push(where("petId", "==", petId));
  const q = query(appointmentsRef, ...constraints, orderBy("date", "asc"), orderBy("time", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Appointment)).filter((item) => item.status !== "cancelled");
}

export async function getBookedSlots(date: string) {
  const q = query(collection(db, "appointmentSlots"), where("date", "==", date));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => item.id);
}

export async function createAppointment(
  ownerId: string,
  data: Omit<Appointment, "id" | "ownerId" | "veterinarian" | "status" | "createdAt">
) {
  if (!isValidAppointmentDate(data.date)) throw new Error("Las citas solo pueden agendarse de lunes a sábado.");
  if (!APPOINTMENT_SLOTS.includes(data.time as (typeof APPOINTMENT_SLOTS)[number])) throw new Error("La hora seleccionada no es válida.");

  const appointmentRef = doc(appointmentsRef);
  const result = await runTransaction(db, async (transaction) => {
    for (const veterinarian of VETERINARIANS) {
      const lockRef = doc(slotsRef, slotId(data.date, data.time, veterinarian.id));
      const lock = await transaction.get(lockRef);
      if (!lock.exists()) {
        transaction.set(lockRef, {
          date: data.date,
          time: data.time,
          veterinarianId: veterinarian.id,
          veterinarian: veterinarian.name,
          appointmentId: appointmentRef.id,
          ownerId,
          createdAt: serverTimestamp(),
        });
        transaction.set(appointmentRef, {
          ...data,
          ownerId,
          veterinarian: veterinarian.name,
          status: "scheduled",
          createdAt: serverTimestamp(),
        });
        return { id: appointmentRef.id, veterinarian: veterinarian.name };
      }
    }
    throw new Error("No hay veterinarios disponibles en ese horario. Selecciona otra hora.");
  });
  return result;
}

export async function cancelAppointment(id: string, date: string, time: string, veterinarian: string) {
  const veterinarianEntry = VETERINARIANS.find((item) => item.name === veterinarian);
  if (!veterinarianEntry) throw new Error("Veterinario no encontrado.");
  await runTransaction(db, async (transaction) => {
    const appointmentRef = doc(appointmentsRef, id);
    const lockRef = doc(slotsRef, slotId(date, time, veterinarianEntry.id));
    transaction.delete(appointmentRef);
    transaction.delete(lockRef);
  });
}
