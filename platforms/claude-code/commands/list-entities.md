---
description: Genera un índice completo de todas las entidades conocidas en el sistema de especificaciones KDD.
---

# Listar Entidades del Dominio

Genera un índice completo de todas las entidades conocidas en el sistema de especificaciones KDD.

## Instrucciones

Escanea los siguientes directorios y extrae las entidades:

### 1. Entidades de Dominio (`specs/01-domain/entities/`)
Para cada archivo `.md`:
- Extrae el nombre del H1
- Lista los aliases del frontmatter
- Indica el estado (draft/approved)

### 2. Eventos (`specs/01-domain/events/`)
Para cada archivo `EVT-*.md`:
- ID del evento
- Nombre descriptivo
- Entidad que lo emite

### 3. Reglas de Negocio (`specs/01-domain/rules/`)
Para cada archivo `BR-*.md` o `BP-*.md`:
- Reglas padre (BR-RETO, BR-SESION, etc.)
- Reglas individuales dentro de cada archivo (BR-XXX-NNN)

### 4. Comandos y Queries (`specs/02-behavior/`)
Para cada archivo `CMD-*.md` o `QRY-*.md`:
- ID y nombre
- Entidades que afecta

### 5. Casos de Uso (`specs/02-behavior/use-cases/`)
Para cada archivo `UC-*.md`:
- ID y nombre
- Actor principal

### 6. Requisitos (`specs/04-verification/criteria/`)
Para cada archivo `REQ-*.md`:
- Requisitos padre (REQ-001, REQ-002)
- Requisitos individuales (REQ-001.1, REQ-001.2, etc.)

## Formato de Salida

```markdown
## Índice de Entidades KDD

### Entidades de Dominio (X)
| Entidad | Aliases | Estado | Archivo |
|---------|---------|--------|---------|

### Eventos (X)
| ID | Nombre | Emisor | Archivo |
|----|--------|--------|---------|

### Reglas de Negocio (X total)
| ID | Nombre | Categoría | Archivo |
|----|--------|-----------|---------|

### Comandos (X)
| ID | Nombre | Entidades | Archivo |
|----|--------|-----------|---------|

### Queries (X)
| ID | Nombre | Entidades | Archivo |
|----|--------|-----------|---------|

### Casos de Uso (X)
| ID | Nombre | Actor | Archivo |
|----|--------|-------|---------|

### Requisitos (X)
| ID | Nombre | Patrón EARS | Archivo |
|----|--------|-------------|---------|
```

Incluye al final estadísticas:
- Total de entidades por tipo
- Entidades sin documentar (referenciadas pero sin archivo)
- Sugerencias de mejora

## Ejemplo de Uso

```bash
/kdd:list-entities
```
