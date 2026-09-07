
# 2. Documentación técnica y de usuario

### 2.1 Manual básico de usuario

#### Acceso y registro

1. Abrir la aplicación y seleccionar **Crear cuenta**.
2. Introducir nombre, correo y una contraseña de al menos seis caracteres.
3. En accesos posteriores, utilizar **Ingresar** con el mismo correo y contraseña.
4. Si las credenciales no son correctas, revisar el mensaje mostrado y volver a intentarlo.

#### Registrar una mascota

1. Desde tu dashboard de incio selecciona la opción para agregar una mascota.
2. Debes de llenar su nombre, especie, sexo y fecha de nacimiento. La raza, peso, descripción y foto son opcionales.
3. Luego click en **Guardar mascota**.
4. Abrir la tarjeta de la mascota para consultar sus datos, editarla o eliminarla.

#### Gestionar vacunas

1. Click en **ver ficha** para acceder a tu mascota.
2. En **Vacunas**, escribir el nombre y la fecha aplicada.
3. Añadir, si se conoce, la próxima dosis y algunas notas que son opcionales.
4. Click en **Registrar vacuna**. 
5. Para eliminar una vacuna, seleccionar el icono de papelera junto a la vacuna y luego click en aceptar.

#### Agendar y cancelar citas

1. En el detalle de la mascota, en la seccion **Citas veterinarias**.
2. Elegir una fecha de lunes a sábado. Los domingos no estamos disponibles.
3. Selecciona ahora un horario disponible entre las 07:00 y las 17:00. Cada bloque dura una hora y finaliza como máximo a las 18:00.
4. Elege uno de los motivos, puedes añadir notas opcionales y luego click en **Agendar cita**.
5. El sistema asigna automáticamente uno de los veterinarios disponibles.
6. Para cancelar, seleccionar el icono de papelera junto a la cita y luego click en aceptar.

### 2.2 Tecnologías utilizadas

| Tecnología | Uso | Justificación |
|---|---|---|
| Next.js 15 con App Router | Estructura de páginas y ejecución de la aplicación web | Ofrece routing basado en archivos, buen rendimiento y una base adecuada para crecer desde un MVP. |
| React 19 | Componentes interactivos como formularios, tarjetas y gestores de vacunas/citas | Permite separar responsabilidades de interfaz y manejar estados de carga, error y guardado. |
| TypeScript | Tipos de mascotas, vacunas, citas y formularios | Reduce errores de integración y hace explícito el contrato de los datos. |
| Firebase Authentication | Registro e inicio de sesión con Email/Password | Evita implementar almacenamiento y manejo de contraseñas propio. |
| Cloud Firestore | Persistencia de usuarios, mascotas, vacunas, citas y bloqueos de agenda | Base de datos documental con consultas por usuario y transacciones para reservar horarios. |
| Firebase Storage | Almacenamiento de fotografías de mascotas | Separa archivos de los documentos y permite aplicar reglas de acceso por usuario. |
| React Hook Form + Zod | Captura y validación del formulario de mascotas | Centraliza reglas como nombre mínimo, peso positivo y campos obligatorios. |
| Tailwind CSS | Estilos responsivos y componentes visuales | Permite construir una interfaz consistente con poco CSS repetido. |
| Lucide React | Iconos de acciones y secciones | Mantiene una iconografía clara y consistente sin crear SVG manuales. |

