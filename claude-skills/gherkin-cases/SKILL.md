---
name: gherkin-cases
description: Genera casos de prueba en Gherkin (Given/When/Then) en español a partir de una historia de usuario o criterios de aceptación. Usar cuando el usuario pide casos de prueba, escenarios, Gherkin, Cucumber o archivos .feature.
---

Al generar casos de prueba en Gherkin:

1. Leé la historia de usuario e identificá los criterios de aceptación. Si falta información importante (reglas de negocio, límites, mensajes de error), listá tus supuestos antes de escribir.
2. Escribí un archivo `.feature` con `# language: es` en la primera línea y usá las palabras clave en español: Característica, Antecedentes, Escenario, Esquema del escenario, Ejemplos, Dado, Cuando, Entonces, Y, Pero.
3. Incluí siempre:
   - Al menos un escenario de camino feliz
   - Escenarios negativos (datos inválidos, campos vacíos, permisos)
   - Casos borde (valores límite, caracteres especiales, longitudes máximas)
4. Usá `Esquema del escenario` + `Ejemplos` cuando solo cambien los datos.
5. Usá `Antecedentes` para los pasos que se repiten en todos los escenarios.
6. Escribí pasos declarativos, que describan comportamiento y no la interfaz. Por ejemplo, "Cuando inicia sesión con credenciales válidas" y no "Cuando hace clic en el botón azul".
7. Agregá etiquetas: @smoke al camino feliz principal, @regresion a todos y @negativo a los escenarios de error.
8. Al final, mostrá una tabla de cobertura: criterio de aceptación → escenarios que lo cubren.
