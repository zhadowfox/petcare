"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { petSchema, type PetFormValues } from "@/lib/validations/pet";
import type { Pet } from "@/types/pet";

type PetFormInput = z.input<typeof petSchema>;

export default function PetForm({
  initial,
  submitLabel = "Guardar mascota",
  onSubmit,
}: {
  initial?: Pet;
  submitLabel?: string;
  onSubmit: (data: PetFormValues, photo?: File) => Promise<void>;
}) {
  const [photo, setPhoto] = useState<File>();
  const [preview, setPreview] = useState(initial?.photoUrl || "");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PetFormInput, any, PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          species: initial.species,
          breed: initial.breed,
          gender: initial.gender,
          birthDate: initial.birthDate,
          weight: initial.weight,
          description: initial.description,
        }
      : { species: "Perro", gender: "Macho", breed: "", description: "" },
  });
  useEffect(
    () => () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  return (
    <form
      className="card space-y-5 p-6"
      onSubmit={handleSubmit((d) => onSubmit(d, photo))}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Nombre *</label>
          <input
            className="input"
            {...register("name")}
            placeholder="Ej. Max"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="label">Especie *</label>
          <select className="input" {...register("species")}>
            <option>Perro</option>
            <option>Gato</option>
            <option>Ave</option>
            <option>Otro</option>
          </select>
        </div>
        <div>
          <label className="label">Raza</label>
          <input
            className="input"
            {...register("breed")}
            placeholder="Ej. Golden Retriever"
          />
        </div>
        <div>
          <label className="label">Sexo *</label>
          <select className="input" {...register("gender")}>
            <option>Macho</option>
            <option>Hembra</option>
          </select>
        </div>
        <div>
          <label className="label">Fecha de nacimiento *</label>
          <input type="date" className="input" {...register("birthDate")} />
          {errors.birthDate && (
            <p className="mt-1 text-xs text-red-600">
              {errors.birthDate.message}
            </p>
          )}
        </div>
        <div>
          <label className="label">Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            className="input"
            {...register("weight")}
          />
          {errors.weight && (
            <p className="mt-1 text-xs text-red-600">{errors.weight.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="label">Descripción</label>
        <textarea
          className="input min-h-28"
          {...register("description")}
          placeholder="Información adicional..."
        />
      </div>
      <div>
        <label className="label">Foto</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setPhoto(f);
              setPreview(URL.createObjectURL(f));
            }
          }}
        />
        {preview && (
          <img
            src={preview}
            alt="Vista previa"
            className="mt-3 h-32 w-32 rounded-2xl object-cover"
          />
        )}
      </div>
      <button
        disabled={isSubmitting}
        className="btn btn-primary w-full md:w-auto"
      >
        {isSubmitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
