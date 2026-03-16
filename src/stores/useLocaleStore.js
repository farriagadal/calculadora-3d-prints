import { reactive } from 'vue'

const STORAGE_LANG_KEY = 'calc3dprints:lang:v1'
const STORAGE_CURRENCY_KEY = 'calc3dprints:currency:v1'

function loadLang() {
  try { const v = localStorage.getItem(STORAGE_LANG_KEY); return v === 'en' ? 'en' : 'es' } catch { return 'es' }
}
function loadCurrency() {
  try { const v = localStorage.getItem(STORAGE_CURRENCY_KEY); return v === 'USD' ? 'USD' : 'CLP' } catch { return 'CLP' }
}

export const localeState = reactive({
  lang: loadLang(),
  currency: loadCurrency(),
})

const strings = {
  es: {
    // App
    appTitle: 'Calculadora de impresión 3D',
    appSubtitle: 'Estima costo por <b>material</b> + <b>electricidad</b> (y un costo fijo opcional). Se calcula automáticamente al escribir. Perfiles guardados en tu navegador.',
    appFooter: 'Hecho para cotizar rápido: material + luz · modelos guardados localmente',
    fabLabel: 'Ver resultados ↓',

    // Tabs
    tabEntradas: 'Entradas',
    tabPerfiles: 'Perfiles de impresora',
    tabHistorial: 'Historial',
    resetValues: 'Resetear valores',

    // InputsTab – básico
    labelPrecioMaterial: 'Precio del filamento',
    hintPrecioMaterial: 'Ej: $16.990 / kg',
    labelMaterialGramos: 'Material a usar',
    hintMaterialGramos: 'Ej: 120 g (del slicer)',
    labelPrecioLuz: 'Precio de la electricidad',
    hintPrecioLuz: 'Revísalo en tu boleta',
    labelTiempo: 'Tiempo de impresión',
    hintTiempo: 'Del slicer (hh:mm)',
    advancedToggle: 'Configuración avanzada',

    // InputsTab – avanzado material
    sectionMaterial: 'Material',
    sectionMaterialSub: 'Merma y costos adicionales',
    labelMerma: 'Merma / desperdicio',
    hintMerma: 'Sugerido: 10%',
    labelCostoFijo: 'Costos adicionales',
    hintCostoFijo: 'IPA, cinta, pegamento…',

    // InputsTab – avanzado electricidad
    sectionElectricidad: 'Electricidad',
    sectionElectricidadSub: 'Impresora y consumo',
    labelImpresora: 'Impresora',
    hintImpresora: 'Carga el perfil de potencia',
    hintImpresoraDefault: '(por defecto)',
    labelPotencia: 'Potencia promedio',
    hintPotencia: 'Del perfil · editable',
    labelConsumoExtra: 'Consumo extra',
    hintConsumoExtra: 'Secador, cámara…',
    noteElectricidad: '💡 La <b>potencia promedio real</b> suele ser menor a la potencia máxima de la fuente. Depende de temperaturas, velocidad y ventiladores. Si tienes un enchufe inteligente o wattímetro, usa ese valor para mayor precisión.',

    // ResultsPanel
    emptyTitle: 'Completa los campos para calcular',
    emptyItem1: 'Precio material',
    emptyItem2: 'Material usado (g)',
    emptyItem3: 'Precio electricidad',
    emptyItem4: 'Tiempo de impresión',
    emptyHint: 'Se calcula automáticamente al completar los campos',
    totalLabel: 'Costo estimado',
    margenLabel: 'Margen',
    precioVentaPrefix: '→ Precio venta:',
    decimalesLabel: 'Decimales',
    rowMaterial: 'Material',
    rowElectricidad: 'Electricidad',
    rowCostoFijo: 'Costo fijo',
    rowKwh: 'kWh estimados',
    rowGramosConMerma: 'Material con merma',
    rowPotenciaTotal: 'Potencia total',
    rowTiempo: 'Tiempo',
    btnCopiar: 'Copiar desglose para cotización',
    btnGuardar: 'Guardar',
    noteResultados: 'Este cálculo es una <b>estimación</b>. Si quieres afinar la electricidad, mide el consumo promedio real de tu impresora (W) durante una impresión típica.',

    // ModelsTab
    sectionPerfiles: 'Perfiles de impresora',
    labelModeloNombre: 'Nombre del modelo',
    hintModeloNombre: 'Ej: Ender 3 V2',
    labelModeloPotencia: 'Potencia promedio (W)',
    btnGuardarCambios: 'Guardar cambios',
    btnGuardarModelo: 'Guardar modelo',
    btnCancelarEdicion: 'Cancelar edición',
    btnRestaurarModelos: 'Restaurar modelos',
    noteModelos: 'Puedes agregar modelos y editarlos. El modelo <span class="tagDefault">por defecto</span> no se elimina, pero puedes duplicarlo creando uno nuevo.',
    thModelo: 'Modelo',
    thPotencia: 'Potencia (W)',
    thAcciones: 'Acciones',
    tagDefault: 'por defecto',
    btnEditar: 'Editar',
    btnBorrar: 'Borrar',

    // HistoryTab
    sectionHistorial: 'Historial',
    subtitleHistorial: 'guardado localmente',
    btnLimpiarHistorial: 'Limpiar historial',
    noteHistorial: 'Aquí se guardan los cálculos que presiones en "Guardar" (no se sube nada a internet).',
    emptyHistory: 'Sin historial todavía. Calcula y presiona "Guardar".',
    btnCargar: 'Cargar',

    // Misc
    labelOpcional: 'opcional',
    badgeListo: '✓ listo',

    // Errores del store
    errPrecioMaterial: 'Ingresa %s/kg (≥ 0).',
    errMaterialGramos: 'Ingresa gramos (≥ 0).',
    errMermaPct: 'Ingresa % merma (≥ 0).',
    errCostoFijo: 'Costo fijo inválido (≥ 0).',
    errPrecioLuz: 'Ingresa %s/kWh (≥ 0).',
    errTiempo: 'Formato inválido. Usa hh:mm (ej: 05:30).',
    errImpresora: 'Selecciona un modelo.',
    errPotenciaW: 'Ingresa potencia (W) (≥ 0).',
    errConsumoExtra: 'Consumo extra inválido (≥ 0).',
    errDecimales: 'Decimales inválidos.',
    errNoCopy: 'No se pudo copiar automáticamente. Selecciona y copia desde el panel.',
    errModeloNombre: 'Ingresa un nombre.',
    errModeloPotencia: 'Ingresa potencia (W) (≥ 0).',
    errModeloNoEncontrado: 'Modelo no encontrado.',

    // Toasts
    toastCopiarPrimero: 'Primero calcula para copiar el desglose',
    toastCopiarDirty: 'Los datos cambiaron. Recalcula antes de copiar',
    toastCopiado: 'Desglose copiado',
    toastGuardarPrimero: 'Calcula primero para guardar',
    toastGuardarDirty: 'Los datos cambiaron, recalcula primero',
    toastGuardado: 'Guardado en historial',
    toastCargado: 'Cálculo cargado',

    // Confirms
    confirmBorrarModelo: '¿Borrar modelo "%s"?',
    confirmRestaurarModelos: '¿Restaurar modelos? Se borrarán los modelos personalizados guardados.',
    confirmBorrarHistorial: '¿Borrar este registro del historial?',
    confirmLimpiarHistorial: '¿Limpiar todo el historial?',

    // Desglose copiado
    copyHeader: 'Cotización impresión 3D',
    copyModelo: '- Modelo:',
    copyTiempo: '- Tiempo:',
    copyMaterial: '- Material:',
    copyElectricidad: '- Electricidad:',
    copyCostoFijo: '- Costo fijo:',
    copyTotal: '= Total:',
    copyMargen: '- Margen (%s%%): → Precio venta:',
  },

  en: {
    // App
    appTitle: '3D Printing Calculator',
    appSubtitle: 'Estimate cost by <b>material</b> + <b>electricity</b> (plus an optional fixed cost). Calculates automatically as you type. Profiles saved in your browser.',
    appFooter: 'Built for quick quotes: material + electricity · models saved locally',
    fabLabel: 'View results ↓',

    // Tabs
    tabEntradas: 'Inputs',
    tabPerfiles: 'Printer Profiles',
    tabHistorial: 'History',
    resetValues: 'Reset values',

    // InputsTab – basic
    labelPrecioMaterial: 'Filament price',
    hintPrecioMaterial: 'E.g. $19.99 / kg',
    labelMaterialGramos: 'Material used',
    hintMaterialGramos: 'E.g. 120 g (from slicer)',
    labelPrecioLuz: 'Electricity price',
    hintPrecioLuz: 'Check your bill',
    labelTiempo: 'Print time',
    hintTiempo: 'From slicer (hh:mm)',
    advancedToggle: 'Advanced settings',

    // InputsTab – advanced material
    sectionMaterial: 'Material',
    sectionMaterialSub: 'Waste and additional costs',
    labelMerma: 'Waste / scrap',
    hintMerma: 'Suggested: 10%',
    labelCostoFijo: 'Additional costs',
    hintCostoFijo: 'IPA, tape, glue…',

    // InputsTab – advanced electricity
    sectionElectricidad: 'Electricity',
    sectionElectricidadSub: 'Printer and consumption',
    labelImpresora: 'Printer',
    hintImpresora: 'Loads the power profile',
    hintImpresoraDefault: '(default)',
    labelPotencia: 'Average power',
    hintPotencia: 'From profile · editable',
    labelConsumoExtra: 'Extra consumption',
    hintConsumoExtra: 'Dryer, enclosure…',
    noteElectricidad: '💡 The <b>real average power</b> is usually lower than the max PSU rating. It depends on temperatures, speed and fans. If you have a smart plug or wattmeter, use that value for better accuracy.',

    // ResultsPanel
    emptyTitle: 'Fill in the fields to calculate',
    emptyItem1: 'Material price',
    emptyItem2: 'Material used (g)',
    emptyItem3: 'Electricity price',
    emptyItem4: 'Print time',
    emptyHint: 'Calculates automatically when fields are complete',
    totalLabel: 'Estimated cost',
    margenLabel: 'Margin',
    precioVentaPrefix: '→ Sale price:',
    decimalesLabel: 'Decimals',
    rowMaterial: 'Material',
    rowElectricidad: 'Electricity',
    rowCostoFijo: 'Fixed cost',
    rowKwh: 'Estimated kWh',
    rowGramosConMerma: 'Material with waste',
    rowPotenciaTotal: 'Total power',
    rowTiempo: 'Time',
    btnCopiar: 'Copy breakdown for quote',
    btnGuardar: 'Save',
    noteResultados: 'This calculation is an <b>estimate</b>. To refine electricity, measure the actual average power consumption (W) of your printer during a typical print.',

    // ModelsTab
    sectionPerfiles: 'Printer profiles',
    labelModeloNombre: 'Model name',
    hintModeloNombre: 'E.g. Ender 3 V2',
    labelModeloPotencia: 'Average power (W)',
    btnGuardarCambios: 'Save changes',
    btnGuardarModelo: 'Save model',
    btnCancelarEdicion: 'Cancel edit',
    btnRestaurarModelos: 'Restore models',
    noteModelos: 'You can add and edit models. The <span class="tagDefault">default</span> model cannot be deleted, but you can duplicate it by creating a new one.',
    thModelo: 'Model',
    thPotencia: 'Power (W)',
    thAcciones: 'Actions',
    tagDefault: 'default',
    btnEditar: 'Edit',
    btnBorrar: 'Delete',

    // HistoryTab
    sectionHistorial: 'History',
    subtitleHistorial: 'saved locally',
    btnLimpiarHistorial: 'Clear history',
    noteHistorial: 'Calculations you save with "Save" are stored here (nothing is uploaded to the internet).',
    emptyHistory: 'No history yet. Calculate and press "Save".',
    btnCargar: 'Load',

    // Misc
    labelOpcional: 'optional',
    badgeListo: '✓ ready',

    // Store errors
    errPrecioMaterial: 'Enter %s/kg (≥ 0).',
    errMaterialGramos: 'Enter grams (≥ 0).',
    errMermaPct: 'Enter waste % (≥ 0).',
    errCostoFijo: 'Invalid fixed cost (≥ 0).',
    errPrecioLuz: 'Enter %s/kWh (≥ 0).',
    errTiempo: 'Invalid format. Use hh:mm (e.g. 05:30).',
    errImpresora: 'Select a model.',
    errPotenciaW: 'Enter power (W) (≥ 0).',
    errConsumoExtra: 'Invalid extra consumption (≥ 0).',
    errDecimales: 'Invalid decimals.',
    errNoCopy: 'Could not copy automatically. Select and copy from the panel.',
    errModeloNombre: 'Enter a name.',
    errModeloPotencia: 'Enter power (W) (≥ 0).',
    errModeloNoEncontrado: 'Model not found.',

    // Toasts
    toastCopiarPrimero: 'Calculate first to copy the breakdown',
    toastCopiarDirty: 'Data changed. Recalculate before copying',
    toastCopiado: 'Breakdown copied',
    toastGuardarPrimero: 'Calculate first to save',
    toastGuardarDirty: 'Data changed, recalculate first',
    toastGuardado: 'Saved to history',
    toastCargado: 'Calculation loaded',

    // Confirms
    confirmBorrarModelo: 'Delete model "%s"?',
    confirmRestaurarModelos: 'Restore models? All custom saved models will be deleted.',
    confirmBorrarHistorial: 'Delete this history entry?',
    confirmLimpiarHistorial: 'Clear all history?',

    // Copy breakdown
    copyHeader: '3D Print Quote',
    copyModelo: '- Model:',
    copyTiempo: '- Time:',
    copyMaterial: '- Material:',
    copyElectricidad: '- Electricity:',
    copyCostoFijo: '- Fixed cost:',
    copyTotal: '= Total:',
    copyMargen: '- Margin (%s%%): → Sale price:',
  },
}

export function t(key) {
  return strings[localeState.lang]?.[key] ?? strings.es[key] ?? key
}

export function tc(key, ...args) {
  let str = t(key)
  for (const arg of args) str = str.replace('%s', String(arg))
  return str
}

export function formatAmount(value, decimals) {
  const cur = localeState.currency
  const d = Number(decimals ?? 0)
  return new Intl.NumberFormat(cur === 'USD' ? 'en-US' : 'es-CL', {
    style: 'currency',
    currency: cur,
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  }).format(Number.isFinite(value) ? value : 0)
}

export function useLocaleStore() {
  function setLang(lang) {
    localeState.lang = lang
    try { localStorage.setItem(STORAGE_LANG_KEY, lang) } catch {}
  }

  function setCurrency(currency) {
    localeState.currency = currency
    try { localStorage.setItem(STORAGE_CURRENCY_KEY, currency) } catch {}
  }

  return { localeState, t, tc, formatAmount, setLang, setCurrency }
}
