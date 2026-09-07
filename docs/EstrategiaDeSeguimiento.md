## 3. Gestión post-proyecto

### 3.1 Seguimiento inicial

- **Día 0:** confirmar despliegue, variables de entorno, Authentication, Firestore, Storage, reglas e índices.
- **Primera semana:** revisar errores de acceso, creación de mascotas, carga de fotos, vacunas y citas; verificar que no haya reservas duplicadas.
- **Primer mes:** realizar una revisión semanal de uso, tiempos de respuesta, errores de Firebase y solicitudes de usuarios.
- **Después del primer mes:** pasar a una revisión mensual y a seguimiento adicional cuando se publique una funcionalidad nueva.

### 3.2 Soporte y niveles de atención

| Prioridad | Ejemplo | Respuesta objetivo | Acción |
|---|---|---|---|
| P1 crítica | El sistema no permite iniciar sesión o se pierden datos | 4 horas hábiles | Escalar al responsable técnico, preservar logs y aplicar recuperación o rollback. |
| P2 alta | No se pueden guardar mascotas, vacunas o citas | 1 día hábil | Reproducir con una cuenta de prueba, revisar Firebase y publicar corrección prioritaria. |
| P3 media | Error visual o validación confusa sin pérdida de datos | 3 días hábiles | Registrar incidencia, priorizarla en el siguiente ciclo y añadir prueba de regresión. |
| P4 baja | Mejora de texto, diseño o nueva funcionalidad | Próximo ciclo | Documentar como solicitud y estimar impacto y esfuerzo. |

Cada incidencia debe registrar fecha, usuario afectado, navegador, pasos para reproducir, mensaje de error, evidencia y resultado de la solución. Nunca se deben solicitar ni almacenar contraseñas en los tickets.

### 3.3 Mantenimiento preventivo

1. Ejecutar `npm run lint` y las pruebas unitarias en cada cambio.
2. Ejecutar ambos flujos E2E antes de cada entrega.
3. Revisar dependencias y actualizar Next.js, Firebase y librerías con una rama de prueba.
4. Supervisar cuotas, errores y reglas de Firebase; realizar exportaciones o respaldos según la política del proyecto.
5. Revisar periódicamente permisos de Firestore y Storage, especialmente las colecciones de vacunas y citas.
6. Mantener actualizado este manual, el inventario de variables de entorno y el procedimiento de recuperación.

### 3.4 Cierre de una incidencia

Una incidencia se cierra cuando la corrección está desplegada, el caso original reproduce el resultado esperado, no aparecen regresiones en E2E y la evidencia queda adjunta al registro. Las solicitudes que cambien el alcance deben aprobarse y planificarse como una nueva versión.