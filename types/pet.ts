export type Species = "Perro" | "Gato" | "Ave" | "Otro";
export type Gender = "Macho" | "Hembra";

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: Species;
  breed: string;
  gender: Gender;
  birthDate: string;
  weight: number | null;
  description: string;
  photoUrl: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Vaccine {
  id: string;
  petId: string;
  ownerId: string;
  name: string;
  date: string;
  nextDate: string;
  notes: string;
  createdAt?: unknown;
}

export interface Appointment {
  id: string;
  petId: string;
  ownerId: string;
  date: string;
  time: string;
  veterinarian: string;
  reason: string;
  notes: string;
  status: "scheduled" | "cancelled";
  createdAt?: unknown;
}

export const VETERINARIANS = [
  { id: "vet-1", name: "Dra. Laura Gómez" },
  { id: "vet-2", name: "Dr. Andrés Martínez" },
] as const;

export const APPOINTMENT_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
] as const;
