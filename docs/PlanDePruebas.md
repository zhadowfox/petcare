# PetCare Manager: pruebas, manual y soporte

Documento de entrega para el MVP académico de gestión de mascotas.

## 1. Plan de pruebas del sistema

### 1.1 Alcance y estrategia

La estrategia combina cuatro pruebas unitarias y dos pruebas end to end (E2E):

- **Pruebas unitarias:** validan funciones deterministas sin interfaz gráfica ni servicios externos. Se cubren validaciones de mascotas y las reglas de disponibilidad de la agenda.
- **Pruebas E2E:** recorren la aplicación desde el navegador y verifican autenticación, formularios, persistencia en Firestore y actualización de la interfaz.
- **Criterio de aprobación:** cada caso debe cumplir el resultado esperado sin errores de consola, datos duplicados ni información visible de otro usuario.
- **Ambiente recomendado:** navegador Chromium, proyecto Firebase de pruebas, Authentication con Email/Password, Firestore y Storage habilitados. Cada ejecución E2E debe usar un correo de prueba nuevo o datos identificados con el ciclo de prueba.

Las evidencias incluidas en este documento son **simuladas**. Representan el formato de evidencia que debe capturarse durante la ejecución; no sustituyen capturas reales del navegador ni registros de Firebase.

### 1.2 Casos de prueba unitarios

| ID | Funcionalidad | Precondiciones | Pasos | Resultado esperado |
|---|---|---|---|---|
| UT-01 | Validación del nombre de mascota | Disponible `petSchema` | 1. Validar una mascota con nombre `Max`. 2. Validar otra con nombre de un solo carácter o vacío. | El primer dato es válido. El segundo es rechazado con el mensaje de mínimo de 2 caracteres. |
| UT-02 | Validación del peso y fecha de mascota | Disponible `petSchema` | 1. Enviar peso `8.5` y fecha válida. 2. Enviar peso `0` o negativo. 3. Omitir la fecha. | El primer registro pasa. El peso no positivo y la fecha ausente generan error de validación. |
| UT-03 | Días permitidos para citas | Disponible `isValidAppointmentDate` | 1. Evaluar una fecha de lunes a sábado. 2. Evaluar un domingo. 3. Evaluar una cadena con formato inválido. | Lunes a sábado devuelve `true`; domingo y formato inválido devuelven `false`. |
| UT-04 | Disponibilidad de horarios | Disponible `getAvailableSlotInfo` | 1. Consultar una fecha válida sin bloqueos. 2. Consultar la misma fecha con el bloqueo de ambos veterinarios para `09:00`. | Sin bloqueos, `09:00` aparece disponible con un veterinario. Con ambos bloqueos, aparece como `Sin disponibilidad`; los demás horarios no cambian. |

**Datos de prueba unitarios:** nombre `Max`, especie `Perro`, sexo `Macho`, fecha `2022-05-10`, peso `8.5`; fechas de agenda `2026-09-07` (lunes), `2026-09-13` (domingo) y hora `09:00`.

### 1.3 Casos de prueba end to end

| ID | Flujo | Precondiciones | Pasos | Resultado esperado |
|---|---|---|---|---|
| E2E-01 | Registro, creación de mascota y vacuna | Aplicación levantada; Firebase configurado; correo de prueba disponible | 1. Abrir `/registro`. 2. Registrar nombre, correo y contraseña de 6 o más caracteres. 3. Confirmar el acceso al dashboard. 4. Crear una mascota con nombre, especie, sexo y fecha. 5. Abrir el detalle y registrar una vacuna con nombre y fecha aplicada. | Se crea la cuenta, el usuario llega a `/dashboard`, la mascota aparece en su listado y la vacuna aparece en su historial después de guardar. |
| E2E-02 | Agenda y cancelación de cita | Usuario autenticado con una mascota; fecha futura de lunes a sábado | 1. Abrir el detalle de la mascota. 2. Seleccionar fecha y horario disponible. 3. Elegir motivo y agendar. 4. Comprobar que la cita muestra fecha, hora y veterinario. 5. Cancelar y confirmar el diálogo. | La cita se guarda una sola vez, el horario queda bloqueado mientras está reservado, la cancelación elimina la cita y libera el horario. Un domingo o un horario pasado se rechaza. |

Evidencia E2E-01
![alt text]([http://url/to/img.png](https://github.com/zhadowfox/petcare/blob/6da1923d90332aa79f84f603c8b39ecbacc5ea5c/docs/prueba%20e2e%201.png))

Evidencia E2E-01
![alt text]([https://github.com/zhadowfox/petcare/blob/6da1923d90332aa79f84f603c8b39ecbacc5ea5c/docs/prueba%20e2e%202.png))

### 1.4 Evidencias simuladas

| Evidencia | Representación simulada | Resultado |
|---|---|---|
| EV-01 | `Dashboard > Mis mascotas`: tarjeta `Max`, especie `Perro`, peso `8.5 kg`; `Detalle > Vacunas`: `Rabia`, aplicada `2026-08-20`. | **APROBADO:** la información creada en E2E-01 permanece visible al recargar. |
| EV-02 | `Detalle > Citas veterinarias`: `09:00–10:00`, `Dra. Laura`, motivo `Consulta general`; tras cancelar, el mensaje `No hay citas agendadas`. | **APROBADO:** la reserva y la liberación del bloque funcionan en E2E-02. |
| EV-03 | Selector de fecha con domingo `2026-09-13` y mensaje `El domingo no está disponible`. | **APROBADO:** la regla de calendario se comunica al usuario. |
| EV-04 | Formulario de mascota con nombre `A` y peso `0`; mensajes de validación bajo ambos campos. | **APROBADO:** los datos inválidos no se envían. |

Para una entrega formal, cada evidencia debe reemplazarse por una captura con fecha, navegador, identificador del caso y, cuando aplique, el documento creado en Firestore. También conviene adjuntar el resultado de `npm run lint` y los logs de ejecución de las pruebas automatizadas.
