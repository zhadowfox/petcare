import { describe, expect, it } from "vitest";
import { petSchema } from "@/lib/validations/pet";

const validPet = {
  name: "Max",
  species: "Perro" as const,
  breed: "Golden Retriever",
  gender: "Macho" as const,
  birthDate: "2022-05-10",
  weight: 8.5,
  description: "Mascota de prueba",
};

describe("petSchema", () => {
  it("UT-01 acepta un nombre de mascota de al menos dos caracteres", () => {
    const result = petSchema.safeParse(validPet);

    expect(result.success).toBe(true);
  });

  it("UT-02 rechaza peso no positivo y fecha de nacimiento ausente", () => {
    const result = petSchema.safeParse({
      ...validPet,
      birthDate: "",
      weight: 0,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["birthDate", "weight"]),
      );
    }
  });
});
