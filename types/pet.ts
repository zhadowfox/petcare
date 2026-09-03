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
  applicationDate: string;
  nextDate?: string;
  notes?: string;
  createdAt?: unknown;
}

export interface Appointment {
  id: string;
  petId: string;
  ownerId: string;
  veterinarianId: string;
  veterinarianName: string;
  date: string;
  time: string;
  duration: number;
  reason?: string;
  status: "scheduled" | "cancelled" | "completed";
  createdAt?: unknown;
}

export interface Veterinarian {
  id: string;
  name: string;
}
