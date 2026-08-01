# Landing Page — Ricardo Diaz · Asesor Financiero

Landing page enfocada en planes de retiro y asesoría financiera.

## Estructura

- `index.html` — Contenido de la página
- `styles.css` — Estilos
- `script.js` — Validación y envío del formulario por correo (FormSubmit)

## Cómo verla

Abre `index.html` directamente en el navegador, o sirve la carpeta con:

```bash
python3 -m http.server 8000
```

y visita `http://localhost:8000`.

## Personalización

- **Foto**: la foto de Ricardo está en `assets/ricardo.png`; para cambiarla basta reemplazar ese archivo.
- **Formulario**: envía los datos por correo mediante FormSubmit. El correo destino se configura en la constante `CORREO_DESTINO` al inicio de `script.js` (la primera vez, FormSubmit envía un correo de activación a esa dirección).
- **Colores**: definidos como variables CSS al inicio de `styles.css` (`--navy`, `--gold`, etc.).
