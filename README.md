# Calculadora de costo impresión 3D (CLP)

Sitio estático (solo `index.html`) para estimar costo por **material + electricidad**.

## Deploy en Vercel

### Opción A: Con Git (recomendado)
- Sube este repositorio a GitHub/GitLab/Bitbucket.
- En Vercel: **Add New → Project** → importa el repo.
- Framework: **Other** (o “No Framework”).
- Build Command: *(vacío)*.
- Output Directory: *(vacío)*.
- Deploy.

### Opción B: Con Vercel CLI
En la carpeta del proyecto:

```bash
npx vercel@latest
```

Luego:

```bash
npx vercel@latest --prod
```

## Notas
- `vercel.json` incluye un **rewrite** a `index.html` (útil si después agregas rutas tipo SPA).


