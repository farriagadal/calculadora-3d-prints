# Calculadora de costo de impresión 3D (Chile, CLP)

Una sola página (`index.html`) para estimar el costo de una impresión 3D en **pesos chilenos (CLP)** considerando:

- **Material**: CLP/kg, gramos usados y % de merma
- **Electricidad**: CLP/kWh, tiempo en `hh:mm` y potencia promedio (W)
- **Costo fijo (opcional)**: insumos como IPA/cinta/pegamento

Además incluye **perfiles de impresora** (Anycubic Kobra 2 Pro por defecto) guardados en tu navegador (`localStorage`).

## Cómo usar

1. Abre `index.html` en tu navegador (doble click).
2. Completa `Entradas`:
   - **Precio material (CLP/kg)**
   - **Material usado (g)**
   - **Merma (%)** (por defecto 10)
   - **Precio luz (CLP/kWh)** (desde tu boleta)
   - **Tiempo de impresión (hh:mm)** (ej: `05:30` o `36:45`)
   - **Impresora (modelo)** y su **potencia promedio (W)**
3. Revisa el panel de **Resultados** (total + desglose).
4. En `Formato de salida`, usa **Copiar desglose** para enviar una cotización rápida por WhatsApp/IG.

## Qué significa CLP/kWh (y de dónde sacarlo)

En Chile la energía eléctrica se cobra típicamente en **CLP por kWh**.

- Revisa tu boleta: busca un ítem similar a **“Energía (kWh)”** y su **precio unitario**.
- Si tu boleta no lo muestra como precio unitario, una aproximación simple es:

\[
\text{CLP/kWh promedio} \approx \frac{\text{Monto energía}}{\text{kWh del período}}
\]

> Ojo: tu boleta puede incluir cargos fijos/otros conceptos; para una estimación “por impresión” suele interesar el componente variable de energía.

## Cómo estimar la potencia promedio (W)

La calculadora usa **potencia promedio** (W), no la potencia máxima.

Opciones:

- **Mejor**: medir con un wattímetro/enchufe medidor durante una impresión típica y usar el promedio.
- **Rápido**: usar un valor referencial y ajustarlo con la experiencia.

La Anycubic Kobra 2 Pro viene precargada con un valor **editable**. El consumo real depende de:

- Temperatura de cama y hotend
- Tiempo calentando vs imprimiendo
- Velocidad/aceleración
- Ventiladores / ambiente

## Fórmulas (resumen)

- **Material con merma (g)** = \( g \times (1 + \frac{\%merma}{100}) \)
- **Costo material** = \( \frac{g_{merma}}{1000} \times CLP/kg \)
- **kWh** = \( \frac{(W_{impresora}+W_{extra})}{1000} \times horas \)
- **Costo electricidad** = \( kWh \times CLP/kWh \)
- **Total** = material + electricidad + costo fijo

## Perfiles de impresora

En `Perfiles de impresora` puedes:

- **Agregar** modelos (nombre + potencia promedio W)
- **Editar** o **borrar** modelos personalizados
- **Restaurar modelos** (elimina los personalizados)

Los datos se guardan en el navegador (no se sube nada a internet).

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


