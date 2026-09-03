# PetCare Manager — MVP

Web app académica para gestionar mascotas.

## Stack
Next.js App Router, React, TypeScript, Tailwind CSS 4, Firebase Authentication, Firestore, Firebase Storage, React Hook Form, Zod, Lucide React y Vercel.

## Incluye
- Landing page
- Registro e inicio de sesión
- Dashboard protegido por autenticación
- Agregar, consultar, editar y eliminar mascotas
- Foto de mascota con Firebase Storage
- Validación de formularios
- Reglas básicas de Firestore y Storage
- Estructura inicial para vacunas y citas

## Instalación
```bash
npm install
```

Copia `.env.example` a `.env.local` y coloca las credenciales de tu aplicación web de Firebase.

En Firebase habilita Authentication con Email/Password, Firestore Database y Storage. Después configura las reglas de `firebase.rules` y `storage.rules`.

Ejecuta:
```bash
npm run dev
```

## Vercel
Conecta el repositorio a Vercel y agrega las mismas variables `NEXT_PUBLIC_FIREBASE_*` en Environment Variables.

## Nota
La consulta de mascotas combina `where(ownerId == uid)` con `orderBy(createdAt desc)`. Firestore puede solicitar un índice compuesto la primera vez; usa el enlace que muestra el error para crearlo.
