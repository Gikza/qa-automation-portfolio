---
name: bug-report
description: Redacta reportes de bugs claros y reproducibles en español, listos para Jira. Usar cuando el usuario describe un error, pide reportar un bug, armar un ticket o un issue, o pega un error de consola o un log.
---

Al redactar un reporte de bug:

1. Si faltan datos clave (entorno, pasos, resultado esperado), preguntalos antes de escribir. Nunca inventes datos.
2. Si el usuario pega un log o error de consola, extraé la línea relevante y explicá en una oración qué indica.
3. Usá este formato:

**Título:** [Módulo] Acción – resultado incorrecto (máximo 80 caracteres)

**Entorno:** ambiente (QA/Staging/Prod), navegador y versión, sistema operativo, dispositivo, usuario de prueba

**Precondiciones:** qué tiene que existir antes de empezar

**Pasos para reproducir:**
1. ...
2. ...

**Resultado esperado:**

**Resultado actual:**

**Severidad:** Crítica / Alta / Media / Baja, con una línea de justificación
- Crítica: bloquea funcionalidad principal, sin alternativa
- Alta: funcionalidad importante afectada, hay alternativa difícil
- Media: funcionalidad secundaria afectada
- Baja: cosmético o de texto

**Frecuencia:** Siempre / Intermitente (x de y intentos) / Una vez

**Evidencia:** capturas, video, logs (indicá qué adjuntar si no hay)

**Notas:** hipótesis de causa o casos relacionados, solo si aporta

4. Al final, sugerí 1 o 2 casos de prueba de regresión para verificar el fix.
