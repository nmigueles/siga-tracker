# SIGA Tracker

Deamon tool para notificar cambios en el SIGA FRBA UTN.

## Implementa

- [SIGA Scraper](https://github.com/NicoMigueles/siga-scraper)

## Configuración

- `WEBHOOK_URL`, cuando ocurre un `evento` se envia una POST REQUEST con la información.
- `SIGA Credentials`.

## Eventos

### Cuando se detecta una nueva asignatura

`POST WEBHOOK_URL/cursos`

Nombre del evento: `new-course`

**Body**

```json
// Ejemplo
{
  "event": "new-course",
  "data": {
    "courseId": "082021",
    "curso": "K1001",
    "nombre": "Algoritmos y Estructura de Datos",
    "aula": "S06",
    "sede": "Campus",
    "turno": "Mañana",
    "color": "#7A94CF",
    "dia": [3],
    "hora": ["8:30"],
    "horaT": ["12:30"]
  }
}
```

### Cuando se detecta una nueva nota

`POST WEBHOOK_URL/notas`

Nombre del evento: `new-grade`

**Body**

```json
// Ejemplo
{
  "event": "new-grade",
  "data": {
    "courseId": "082021",
    "name": "Algoritmos y Estructura de Datos",
    "notas": [
      {
        "instancia": "PP",
        "calificacion": 8
      }
    ]
  }
}
```
