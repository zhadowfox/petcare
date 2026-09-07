import { describe, expect, it } from "vitest";
import {
  getAvailableSlotInfo,
  isValidAppointmentDate,
} from "@/lib/services/appointmentRules";

describe("reglas de agenda", () => {
  it("UT-03 permite lunes a sábado y rechaza domingos o fechas inválidas", () => {
    expect(isValidAppointmentDate("2026-09-07")).toBe(true);
    expect(isValidAppointmentDate("2026-09-13")).toBe(false);
    expect(isValidAppointmentDate("2026/09/07")).toBe(false);
  });

  it("UT-04 marca un horario como no disponible cuando ambos veterinarios están bloqueados", () => {
    const date = "2026-09-07";
    const withoutBookings = getAvailableSlotInfo(date, []);
    const withBothVeterinariansBooked = getAvailableSlotInfo(date, [
      `${date}_0900_vet-1`,
      `${date}_0900_vet-2`,
    ]);

    expect(withoutBookings.find((slot) => slot.time === "09:00")).toMatchObject({
      available: true,
    });
    expect(
      withBothVeterinariansBooked.find((slot) => slot.time === "09:00"),
    ).toMatchObject({
      available: false,
      veterinarian: null,
    });
    expect(
      withBothVeterinariansBooked.find((slot) => slot.time === "10:00"),
    ).toMatchObject({
      available: true,
    });
  });
});
