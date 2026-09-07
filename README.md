# PetCare Manager

MVP académico construido con Next.js App Router, TypeScript, Tailwind CSS y Firebase.

Consulta la [documentación de pruebas, manual de usuario y soporte](docs/DOCUMENTACION_PROYECTO.md).

## Funcionalidades
- Landing page
- Registro e inicio de sesión con Firebase Authentication
- CRUD de mascotas
- Fotos con Firebase Storage
- Historial de vacunas
- Agenda veterinaria
- Citas de lunes a sábado, 07:00–18:00, bloques de una hora
- Dos veterinarios con asignación automática según disponibilidad
- Cancelación de citas
- Reglas de seguridad Firestore/Storage

## Instalación
```bash
npm install
npm run dev
```

Configura `.env.local` a partir de `.env.example`.

## Firebase
Habilita Email/Password en Authentication, crea Firestore y Storage.

Para publicar reglas e índices con Firebase CLI:
```bash
firebase login
firebase use petcare-85659
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Agenda
El sistema ofrece 11 horarios por veterinario:
07:00, 08:00, 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00 y 17:00.
Cada cita dura una hora y termina a las 18:00 como máximo. Domingo está bloqueado.

La disponibilidad se protege con documentos de bloqueo `appointmentSlots`, de modo que una misma combinación fecha/hora/veterinario no pueda reservarse dos veces mediante una transacción de Firestore.

### Pruebas
En la carpeta /doc se encuentra el plan de pruebas unitarias y E2E junto con el manual de usuario, puedes ingresar para ver los resultados
