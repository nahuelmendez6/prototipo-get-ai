# AI Writing Assistant – Prototipo Frontend Interactivo

Prototipo interactivo de alta fidelidad diseñado para **institutos de idiomas** que evalúan incorporar asistencia de inteligencia artificial en la corrección pedagógica de redacciones en inglés (exámenes Cambridge B2 First, C1 Advanced, PET B1, etc.).

El objetivo es validar el concepto de producto con directores, docentes y alumnos sin depender de backend, servidores o APIs externas reales.

---

## 🚀 Inicio Rápido

Para iniciar el servidor de desarrollo local:

```bash
# Instalar dependencias (ya instaladas)
npm install

# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# O compilar y previsualizar la versión de producción
npm run build
npm run preview
```

---

## 🔑 Cuentas de Demostración y Regla de Contraseñas

> **Regla de Credenciales del Instituto:**  
> **La contraseña inicial de cada usuario es su DNI.**

El sistema cuenta con un selector de rol rápido de **1 clic** en la pantalla de inicio de sesión y un panel flotante inferior accesible en todo momento para alternar de rol sin tener que reiniciar sesión.

| Rol | Nombre | Correo Demo | Contraseña Inicial (DNI) | Alcance en la Plataforma |
|---|---|---|---|---|
| **Administrador** | Lic. Roberto Santillán | `admin@demo.com` | `10000001` | Gestión de cursos, usuarios, asignación de docentes, matrículas y métricas globales del instituto. |
| **Docente** | Prof. Laura Morales | `teacher@demo.com` | `20000002` | Creación de consignas, subida de fotos manuscritas de alumnos, revisión y edición de correcciones IA, rúbricas y publicación de notas. |
| **Estudiante** | Carlos Gómez | `student@demo.com` | `30000003` | Entrega virtual y manuscrita, visualización de correcciones publicadas por su profesor y seguimiento de progreso. |

*Otras cuentas para pruebas de nómina:*  
- Prof. David Miller (`david.miller@institute.edu`, DNI: `22445566`)
- Estudiante Sofía Rossi (`sofia.rossi@alumnos.edu`, DNI: `38123456`)
- Estudiante Mateo Benítez (`mateo.benitez@alumnos.edu`, DNI: `39654321`)
- Estudiante Elena Álvarez (`elena.alvarez@alumnos.edu`, DNI: `40112233`)

---

## 🛠️ Tecnologías Utilizadas

- **React 18** + **TypeScript**
- **Vite** para desarrollo y empaquetado ultra rápido
- **Tailwind CSS** para un diseño moderno de nivel SaaS educativo
- **React Router DOM v6** para navegación fluida
- **Lucide React** para iconografía consistente
- **LocalStorage API** para persistencia reactiva de datos (CRUD, entregas, notas y estados)

---

## 📋 Módulos Principales del Prototipo

### 1. Panel de Control por Rol (Dashboards)
- **Administrador:** Métricas globales (alumnos, docentes, cursos, entregas pendientes, promedio institucional de calificación y bitácora de actividad en tiempo real).
- **Docente:** Cursos a cargo, entregas pendientes de revisión, accesos directos para evaluar con IA y próximos vencimientos.
- **Estudiante:** Consignas disponibles, estado de sus entregas, promedio acumulado y última devolución del profesor.

### 2. Gestión de Cursos y Matrículas
- Altas, bajas y modificaciones de cursos con código institucional, nivel CEFR (A1-C2), horarios y períodos académicos.
- Asignación de docente titular y matriculación selectiva de alumnos (modal interactivo).

### 3. Gestión de Consignas de Redacción (Writing Tasks)
- Creación de consignas con:
  - Formato de texto: *Essay, Email, Article, Story, Review, Report, etc.*
  - Nivel CEFR (*A1, A2, B1, B2, C1, C2*).
  - Rango de palabras mínimo y máximo.
  - Fecha de entrega y consigna en inglés (*Cambridge style prompt*).
  - Rúbricas ponderadas (Gramática, Vocabulario, Ortografía, Coherencia, Cumplimiento de consigna).

### 4. Métodos de Entrega
- **Método 1: Redacción Manuscrita (Foto):**
  - Subida de foto o selección de muestras realistas caligráficas preparadas.
  - Vista previa interactiva de la hoja de cuaderno.
  - Asociación con alumno y consigna.
  - Simulación de OCR y procesamiento por IA con pantalla de carga interactiva por etapas.
- **Método 2: Redacción Virtual:**
  - Editor de texto integrado con contador de palabras en tiempo real.
  - Indicadores visuales de rango (óptimo, por debajo del mínimo, excedido).
  - Guardado de borradores en memoria local.
  - Simulación inmediata de análisis de IA al enviar.

### 5. Interfaz de Corrección Asistida por IA (Núcleo del Sistema)
Diseñada para que el docente tenga el control total sobre la evaluación:
1. **Fotografía original del manuscrito** (con pestaña para visualizar el cuaderno del alumno).
2. **Texto transcripto** mediante OCR.
3. **Versión corregida**, completamente editable por el docente.
4. **Listado de observaciones/errores** clasificados por tipo (Gramática, Vocabulario, Ortografía, Estilo, etc.) e impacto.
5. **Explicación pedagógica** de cada error.
6. **Desglose de rúbricas (0 a 10):** Gramática, Vocabulario, Ortografía/Puntuación, Coherencia y Consigna.
7. **Nota final sugerida por IA y modificable por el docente.**
8. **Devolución pedagógica cualitativa (Feedback).**
9. **Recomendaciones de mejora** para futuras producciones.
10. **Flujo de estados completo:**
    - `SUBMITTED` → `PROCESSING` → `PENDING_REVIEW` → `NEEDS_REVISION` → `APPROVED` → `PUBLISHED`.
11. **Garantía de privacidad pedagógica:** Los estudiantes **NUNCA** ven correcciones ni notas que no hayan sido aprobadas y publicadas por el docente.

### 6. Seguimiento de Progreso del Alumno
- Ficha de perfil del estudiante con cursos activos.
- Historial completo de entregas con estado y calificaciones.
- Gráfica de evolución temporal de notas.
- Análisis de patrones de errores frecuentes (ej. tiempos verbales, conectores, contracciones informales).

### 7. Gestión de Usuarios (Solo Administrador)
- Alta, edición y baja de docentes, alumnos y administradores.
- Recordatorio permanente de la regla de acceso (Contraseña inicial = DNI).
- Botón de cambio rápido "Simular" para entrar inmediatamente con la cuenta de cualquier usuario listado.

---

## 💡 Guía para Demostraciones a Institutos

Para mostrar el flujo completo durante una reunión con directivos o coordinadores:

1. **Ingresa como Docente** (`teacher@demo.com` o clic en el botón *Docente* en el login).
2. En el Dashboard Docente, dirígete a **"Entregas que requieren tu Revisión"** y haz clic en **"Revisar Corrección IA"** sobre la entrega de *Carlos Gómez* (*FCE Essay*).
3. Muestra la pestaña de la **foto del cuaderno manuscrito** y la transcripción.
4. Explica cómo la IA sugiere los errores (*don't must*, *have many*, etc.) pero el docente puede:
   - Modificar la nota final con el control numérico o deslizadores.
   - Editar el texto corregido.
   - Modificar o agregar nuevas observaciones.
5. Haz clic en **"Aprobar Corrección"** y luego en **"Publicar al Alumno"**.
6. Usa el selector flotante inferior (*Modo Prototipo Demo*) y cambia al rol de **Estudiante** (*Carlos Gómez*).
7. Observa cómo ahora en el panel del alumno aparece la calificación oficial de 8.3/10, las recomendaciones de mejora y la devolución completa aprobada por el profesor.
8. En el selector flotante, haz clic en **"Reiniciar Datos"** en cualquier momento para volver a los datos originales de demostración.
