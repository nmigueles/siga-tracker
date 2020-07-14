# SIGA Tracker

Deamon tool para detectar cambios en el SIGA FRBA UTN.

Cuando se detecta un `evento` se activa el webhook configurado a ese evento en particular.

## Implementa

- [SIGA Scraper](https://github.com/NicoMigueles/siga-scraper) - Herramienta para extraer información del SIGA.

## Eventos

### Cuando se detecta una nueva asignatura

`POST WEBHOOK_URL_NEW_COURSE`

Nombre del evento: `new-course`

**Body**

```json
// Ejemplo
{
  "event": "new-course",
  "data": [
    {
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
  ]
}
```

### Cuando se detecta una nueva nota

`POST WEBHOOK_URL_NEW_GRADE`

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

## Como usarlo

```bash
cp .env.sample .env
# Cambiar valores del .env.
docker-compose up
```

## Configuración en .env

- `WEBHOOK_URL_NEW_COURSE`, webhook al que se envia una `POST REQUEST` cuando se detecta una nueva asignatura.
- `WEBHOOK_URL_NEW_GRADE`, webhook al que se envia una `POST REQUEST` cuando se detecta una nueva nota.
- `USER` - Usuario del SIGA.
- `PASS` - Contraseña del SIGA.
- `MONGO_URI` - MongoDB URI, conexión a la base de datos.
