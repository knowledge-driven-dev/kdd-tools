---
description: Analiza un archivo para detectar entidades de dominio que deberían enlazarse con wiki-links.
---

# Análisis Inteligente de Entidades

Analiza el archivo `$ARGUMENTS` para detectar entidades de dominio que deberían enlazarse con wiki-links `[[entidad]]`.

## Instrucciones

1. **Primero**, lee el archivo especificado en $ARGUMENTS
2. **Segundo**, construye el contexto de entidades conocidas leyendo los archivos en:
   - `specs/01-domain/entities/*.md` - Entidades del dominio
   - `specs/01-domain/events/*.md` - Eventos del sistema
   - `specs/01-domain/rules/*.md` - Reglas de negocio
   - `specs/02-behavior/commands/*.md` - Comandos
   - `specs/02-behavior/queries/*.md` - Queries
   - `specs/02-behavior/use-cases/*.md` - Casos de uso

3. **Analiza** el contenido del archivo buscando:

### A. Menciones Explícitas
Palabras que coinciden exactamente con nombres de entidades conocidas pero no están enlazadas.

### B. Sinónimos y Variaciones
- Plurales/singulares (Reto/Retos, Sesión/Sesiones)
- Variaciones con/sin tilde (Sesion/Sesión)
- Términos equivalentes en el dominio

### C. Referencias Implícitas
- "el usuario" → podría ser [[Usuario]]
- "al crear" en contexto de retos → podría referenciar [[UC-001-Crear-Reto]]
- "la regla de límite" → podría ser [[BR-RETO-002]]

### D. Abreviaciones y Códigos
- UC-001 → [[UC-001-Crear-Reto]]
- BR-RETO-001 → enlace a la sección específica

### E. Entidades Potencialmente Faltantes
Conceptos mencionados repetidamente que podrían necesitar su propia documentación.

## Formato de Salida

Presenta los resultados en este formato:

### Resumen
- Total de menciones sin enlazar encontradas
- Entidades más referenciadas sin link

### Menciones a Enlazar

| Línea | Texto Original | Sugerencia | Tipo | Confianza |
|-------|---------------|------------|------|-----------|
| 15 | "el reto" | [[Reto]] | implícita | Alta |
| 23 | "usuarios" | [[Usuario]] | plural | Alta |
| 45 | "BR-RETO-001" | [[BR-RETO-001]] | código | Exacta |

### Entidades Faltantes Sugeridas
Lista de conceptos que aparecen frecuentemente y podrían necesitar documentación propia.

### Comandos de Corrección
Si es posible, sugiere los comandos Edit para aplicar las correcciones más importantes.

## Ejemplo de Uso

```bash
/kdd:analyze-entities specs/02-behavior/use-cases/UC-001-Crear-Reto.md
```
