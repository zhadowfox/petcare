import { z } from "zod";
export const petSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres."),
  species: z.enum(["Perro", "Gato", "Ave", "Otro"]),
  breed: z.string().trim().max(60).default(""),
  gender: z.enum(["Macho", "Hembra"]),
  birthDate: z.string().min(1, "Selecciona la fecha de nacimiento."),
  weight: z.coerce
    .number()
    .positive("El peso debe ser mayor que 0.")
    .nullable()
    .optional(),
  description: z.string().trim().max(500).default(""),
});
export type PetFormValues = z.infer<typeof petSchema>;
