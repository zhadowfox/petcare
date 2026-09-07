import { APPOINTMENT_SLOTS, VETERINARIANS } from "@/types/pet";

export function isValidAppointmentDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00`);
  return !Number.isNaN(parsed.getTime()) && parsed.getDay() !== 0;
}

function slotId(date: string, time: string, veterinarianId: string) {
  return `${date}_${time.replace(":", "")}_${veterinarianId}`;
}

export function getAvailableSlotInfo(date: string, bookedSlotIds: string[]) {
  if (!isValidAppointmentDate(date)) return [];
  return APPOINTMENT_SLOTS.map((time) => {
    const availableVeterinarian = VETERINARIANS.find(
      (vet) => !bookedSlotIds.includes(slotId(date, time, vet.id)),
    );
    return {
      time,
      available: Boolean(availableVeterinarian),
      veterinarian: availableVeterinarian?.name ?? null,
    };
  });
}