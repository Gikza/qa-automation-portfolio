---
name: pr-description
description: Redacta descripciones de pull requests en español, con pasos de prueba y control de calidad de los tests. Usar cuando el usuario pide crear un PR, escribir la descripción de un PR o resumir los cambios de una rama. Use when creating or writing a PR.
---

Al redactar la descripción de un PR:

1. Ejecutá `git diff main...HEAD` para ver todos los cambios de la rama.
2. Ejecutá `git log main..HEAD --oneline` para leer los mensajes de commit.
3. Revisá los archivos de test modificados (`.spec`, `.test`, `.feature`) y detectá:
   - Tests vacíos (sin pasos dentro)
   - Tests sin `expect` o assertions
   - Tests marcados con `.skip` u `.only`
   - Esperas fijas como `waitForTimeout` o `sleep`
4. Escribí la descripción en español con este formato:

## Qué
Una oración que explique qué hace este PR.

## Por qué
Contexto breve de por qué se necesita el cambio. Si no está claro en el diff ni en los commits, escribí "[Completar: motivo del cambio]" en lugar de inventarlo.

## Cambios
- Lista de los cambios concretos
- Agrupá los cambios relacionados
- Mencioná archivos borrados o renombrados

## Cómo probar
1. Pasos numerados para que quien revise pueda verificar el cambio
2. Incluí el comando para correr los tests si aplica (por ejemplo `npx playwright test`)
3. Indicá el resultado esperado

## Alertas de calidad
Solo si encontraste problemas en el paso 3: listá cada uno con archivo y nombre del test, y sugerí cómo corregirlo. Si no hay problemas, omití esta sección.