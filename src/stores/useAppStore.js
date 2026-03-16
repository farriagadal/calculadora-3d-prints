import { reactive } from 'vue'

const STORAGE_KEY = 'calc3dprints:printerModels:v1'
const STORAGE_TAB_KEY = 'calc3dprints:activeTab:v1'
const STORAGE_HISTORY_KEY = 'calc3dprints:history:v1'

const DEFAULT_MODELS = [
  {
    id: 'builtin-kobra2pro',
    nombre: 'Anycubic Kobra 2 Pro',
    potenciaW: 200,
    builtin: true,
  },
]

// Estado compartido a nivel de módulo
const state = reactive({
  models: [],
  history: [],
  activeTab: 'entradas',
  dirty: false,
  lastCalc: null,
  estadoText: 'Listo',
  estadoKind: 'warn',

  // Inputs del formulario
  precioMaterial: '',
  materialGramos: '',
  mermaPct: '10',
  costoFijo: '0',
  precioLuz: '220',
  tiempoHoras: '0',
  tiempoMinutos: '00',
  impresoraId: '',
  potenciaW: '',
  consumoExtraW: '0',
  decimales: '0',

  // Formulario de modelos
  modeloNombre: '',
  modeloPotenciaW: '',
  editingModelId: null,

  // Errores
  errors: {
    precioMaterial: '',
    materialGramos: '',
    mermaPct: '',
    costoFijo: '',
    precioLuz: '',
    tiempo: '',
    impresora: '',
    potenciaW: '',
    consumoExtraW: '',
    decimales: '',
    copiar: '',
    modeloNombre: '',
    modeloPotenciaW: '',
  },
})

// Utilidades
function clampMin0(n) {
  if (!Number.isFinite(n)) return NaN
  return n < 0 ? NaN : n
}

function parseNumber(val) {
  const raw = String(val ?? '').trim()
  if (raw === '') return NaN
  const n = Number(raw)
  return clampMin0(n)
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function parseTimeHHMM(value) {
  const raw = String(value ?? '').trim()
  const m = raw.match(/^(\d+):([0-5]\d)$/)
  if (!m) return null
  const hh = Number(m[1])
  const mm = Number(m[2])
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null
  return {
    hh,
    mm,
    hours: hh + mm / 60,
    raw: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
  }
}

export function formatCLP(value, decimals) {
  const d = Number(decimals)
  const fmt = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  })
  return fmt.format(Number.isFinite(value) ? value : 0)
}

export function formatDateTime(ts) {
  try {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts))
  } catch {
    return new Date(ts).toLocaleString()
  }
}

// Persistencia de modelos
function loadModelsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [...DEFAULT_MODELS]
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return [...DEFAULT_MODELS]
    const sanitized = parsed
      .filter((m) => m && typeof m === 'object')
      .map((m) => ({
        id: String(m.id || ''),
        nombre: String(m.nombre || '').trim(),
        potenciaW: Number(m.potenciaW),
        builtin: Boolean(m.builtin),
      }))
      .filter((m) => m.id && m.nombre && Number.isFinite(m.potenciaW) && m.potenciaW >= 0)
    const hasKobra = sanitized.some((m) => m.id === 'builtin-kobra2pro')
    if (!hasKobra) sanitized.unshift(DEFAULT_MODELS[0])
    return sanitized
  } catch {
    return [...DEFAULT_MODELS]
  }
}

function persistModels(nextModels) {
  state.models = nextModels
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.models))
}

// Persistencia de historial
function loadHistoryFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((h) => h && typeof h === 'object')
      .map((h) => ({
        id: String(h.id || ''),
        ts: Number(h.ts),
        modelId: String(h.modelId || ''),
        modelName: String(h.modelName || ''),
        inputs: h.inputs && typeof h.inputs === 'object' ? h.inputs : null,
        outputs: h.outputs && typeof h.outputs === 'object' ? h.outputs : null,
      }))
      .filter((h) => h.id && Number.isFinite(h.ts) && h.inputs && h.outputs)
  } catch {
    return []
  }
}

function persistHistory(next) {
  state.history = next
  localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(state.history))
}

export function useAppStore() {
  function init() {
    state.models = loadModelsFromStorage()
    state.history = loadHistoryFromStorage()

    const saved = localStorage.getItem(STORAGE_TAB_KEY)
    state.activeTab = ['entradas', 'formato', 'perfiles', 'historial'].includes(saved) ? saved : 'entradas'

    // Asegura que impresoraId sea válido
    if (!state.impresoraId || !state.models.some((m) => m.id === state.impresoraId)) {
      state.impresoraId = state.models[0]?.id || ''
    }

    syncPowerFromSelectedModel()
  }

  function setActiveTab(tab) {
    state.activeTab = tab
    try { localStorage.setItem(STORAGE_TAB_KEY, tab) } catch {}
  }

  function setEstado(text, kind) {
    state.estadoText = text
    state.estadoKind = kind
  }

  function markDirty() {
    state.dirty = true
    if (state.lastCalc) setEstado('Pendiente', 'warn')
    else setEstado('Listo', 'warn')
  }

  function clearAllErrors() {
    for (const k of Object.keys(state.errors)) state.errors[k] = ''
  }

  function setError(key, msg) {
    state.errors[key] = msg || ''
  }

  // Modelos
  function upsertModel(model) {
    const idx = state.models.findIndex((m) => m.id === model.id)
    if (idx >= 0) {
      const next = [...state.models]
      next[idx] = model
      persistModels(next)
    } else {
      persistModels([...state.models, model])
    }
  }

  function syncPowerFromSelectedModel() {
    if (!state.impresoraId || !state.models.some((m) => m.id === state.impresoraId)) {
      state.impresoraId = state.models[0]?.id || ''
    }
    if (String(state.potenciaW).trim() !== '') return
    const m = state.models.find((x) => x.id === state.impresoraId)
    if (m) state.potenciaW = String(Math.round(m.potenciaW))
  }

  function onImpresoraChange() {
    const m = state.models.find((x) => x.id === state.impresoraId)
    if (m) state.potenciaW = String(Math.round(m.potenciaW))
    markDirty()
  }

  function selectedModelName() {
    const m = state.models.find((x) => x.id === state.impresoraId)
    return m ? m.nombre : '—'
  }

  function setModelFormMode(mode) {
    if (mode === 'create') {
      state.modeloNombre = ''
      state.modeloPotenciaW = ''
      state.editingModelId = null
    }
  }

  function startEditModel(id) {
    const m = state.models.find((x) => x.id === id)
    if (!m) return
    state.editingModelId = id
    state.modeloNombre = m.nombre
    state.modeloPotenciaW = String(Math.round(m.potenciaW))
    setError('modeloNombre', '')
    setError('modeloPotenciaW', '')
  }

  function saveModel() {
    setError('modeloNombre', '')
    setError('modeloPotenciaW', '')
    const nombre = String(state.modeloNombre || '').trim()
    const potenciaW = parseNumber(state.modeloPotenciaW)
    let ok = true
    if (!nombre) { setError('modeloNombre', 'Ingresa un nombre.'); ok = false }
    if (!Number.isFinite(potenciaW)) { setError('modeloPotenciaW', 'Ingresa potencia (W) (≥ 0).'); ok = false }
    if (!ok) return

    if (state.editingModelId) {
      const prev = state.models.find((m) => m.id === state.editingModelId)
      if (!prev) { setError('modeloNombre', 'Modelo no encontrado.'); return }
      if (prev.builtin) {
        const newId = `user-${Date.now()}-${Math.random().toString(16).slice(2)}`
        upsertModel({ id: newId, nombre, potenciaW, builtin: false })
        state.impresoraId = newId
      } else {
        upsertModel({ ...prev, nombre, potenciaW, builtin: false })
        state.impresoraId = prev.id
      }
      setModelFormMode('create')
    } else {
      const newId = `user-${Date.now()}-${Math.random().toString(16).slice(2)}`
      upsertModel({ id: newId, nombre, potenciaW, builtin: false })
      state.impresoraId = newId
    }
    state.potenciaW = String(Math.round(potenciaW))
    markDirty()
  }

  function deleteModelWithConfirm(id) {
    const m = state.models.find((x) => x.id === id)
    if (!m || m.builtin) return
    if (!confirm(`¿Borrar modelo "${m.nombre}"?`)) return
    persistModels(state.models.filter((x) => x.id !== id))
    setModelFormMode('create')
    // Resetea impresoraId si se borró el seleccionado
    if (!state.models.some((x) => x.id === state.impresoraId)) {
      state.impresoraId = state.models[0]?.id || ''
    }
    state.potenciaW = ''
    syncPowerFromSelectedModel()
    recalcAuto()
  }

  function restoreModelsWithConfirm() {
    if (!confirm('¿Restaurar modelos? Se borrarán los modelos personalizados guardados.')) return
    persistModels([...DEFAULT_MODELS])
    setModelFormMode('create')
    state.impresoraId = state.models[0]?.id || ''
    state.potenciaW = ''
    syncPowerFromSelectedModel()
    markDirty()
  }

  // Cálculo
  function getCurrentTimeString() {
    const hh = Number(state.tiempoHoras)
    const mm = Number(state.tiempoMinutos)
    return `${hh}:${pad2(mm)}`
  }

  function validateAndCompute() {
    clearAllErrors()

    const precioMaterial = parseNumber(state.precioMaterial)
    const materialGramos = parseNumber(state.materialGramos)
    const mermaPct = parseNumber(state.mermaPct)
    const costoFijo = (() => {
      const raw = String(state.costoFijo || '').trim()
      if (raw === '') return 0
      return parseNumber(state.costoFijo)
    })()
    const precioLuz = parseNumber(state.precioLuz)
    const potenciaW = parseNumber(state.potenciaW)
    const consumoExtraW = (() => {
      const raw = String(state.consumoExtraW || '').trim()
      if (raw === '') return 0
      return parseNumber(state.consumoExtraW)
    })()
    const decimales = Number(state.decimales)
    const tiempo = parseTimeHHMM(getCurrentTimeString())

    let ok = true
    if (!Number.isFinite(precioMaterial)) { setError('precioMaterial', 'Ingresa CLP/kg (≥ 0).'); ok = false }
    if (!Number.isFinite(materialGramos)) { setError('materialGramos', 'Ingresa gramos (≥ 0).'); ok = false }
    if (!Number.isFinite(mermaPct)) { setError('mermaPct', 'Ingresa % merma (≥ 0).'); ok = false }
    if (!Number.isFinite(costoFijo)) { setError('costoFijo', 'Costo fijo inválido (≥ 0).'); ok = false }
    if (!Number.isFinite(precioLuz)) { setError('precioLuz', 'Ingresa CLP/kWh (≥ 0).'); ok = false }
    if (!tiempo) { setError('tiempo', 'Formato inválido. Usa hh:mm (ej: 05:30).'); ok = false }
    if (!state.impresoraId) { setError('impresora', 'Selecciona un modelo.'); ok = false }
    if (!Number.isFinite(potenciaW)) { setError('potenciaW', 'Ingresa potencia (W) (≥ 0).'); ok = false }
    if (!Number.isFinite(consumoExtraW)) { setError('consumoExtraW', 'Consumo extra inválido (≥ 0).'); ok = false }
    if (![0, 1, 2].includes(decimales)) { setError('decimales', 'Decimales inválidos.'); ok = false }
    if (!ok) return { ok: false }

    const mermaFactor = 1 + mermaPct / 100
    const gramosConMerma = materialGramos * mermaFactor
    const costoMaterial = (gramosConMerma / 1000) * precioMaterial
    const potenciaTotalW = potenciaW + consumoExtraW
    const kWh = (potenciaTotalW / 1000) * tiempo.hours
    const costoLuz = kWh * precioLuz
    const total = costoMaterial + costoLuz + costoFijo

    return {
      ok: true,
      inputs: { precioMaterial, materialGramos, mermaPct, costoFijo, precioLuz, potenciaW, consumoExtraW, potenciaTotalW, decimales, tiempo },
      outputs: { costoMaterial, costoLuz, total, kWh, gramosConMerma },
    }
  }

  function recalc(reason) {
    const calc = validateAndCompute()
    if (!calc.ok) {
      if (reason === 'manual') setEstado('Revisa campos', 'bad')
      else setEstado('Listo', 'warn')
      state.lastCalc = null
      return null
    }
    state.lastCalc = calc
    state.dirty = false
    setEstado('Calculado', 'ok')
    return calc
  }

  function recalcManual() { recalc('manual') }
  function recalcAuto() { recalc('auto') }

  // Copiar
  async function copyBreakdown() {
    setError('copiar', '')
    if (!state.lastCalc) {
      setError('copiar', 'Primero presiona "Calcular" para generar un cálculo.')
      return
    }
    if (state.dirty) {
      setError('copiar', 'Los datos cambiaron. Presiona "Calcular" nuevamente antes de copiar.')
      return
    }
    const calc = state.lastCalc
    const d = calc.inputs.decimales
    const text =
      `Cotización impresión 3D\n` +
      `- Modelo: ${selectedModelName()}\n` +
      `- Tiempo: ${calc.inputs.tiempo.raw}\n` +
      `- Material: ${calc.inputs.materialGramos.toFixed(1)} g (+${calc.inputs.mermaPct.toFixed(1)}% merma = ${calc.outputs.gramosConMerma.toFixed(1)} g)\n` +
      `- Material: ${formatCLP(calc.outputs.costoMaterial, d)}\n` +
      `- Electricidad: ${formatCLP(calc.outputs.costoLuz, d)} (kWh: ${calc.outputs.kWh.toFixed(3)})\n` +
      `- Costo fijo: ${formatCLP(calc.inputs.costoFijo, d)}\n` +
      `= Total: ${formatCLP(calc.outputs.total, d)}`

    try {
      await navigator.clipboard.writeText(text)
      setEstado('Copiado', 'ok')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      try {
        document.execCommand('copy')
        setEstado('Copiado', 'ok')
      } catch {
        setError('copiar', 'No se pudo copiar automáticamente. Selecciona y copia desde el panel.')
      } finally {
        document.body.removeChild(ta)
      }
    }
  }

  // Historial
  function saveCurrentCalcToHistory() {
    if (!state.lastCalc) { setEstado('Calcula primero', 'warn'); return }
    if (state.dirty) { setEstado('Pendiente', 'warn'); return }

    const id = `h-${Date.now()}-${Math.random().toString(16).slice(2)}`
    const modelId = state.impresoraId || ''
    const modelName = selectedModelName()
    const inputsSnapshot = {
      precioMaterial: state.precioMaterial,
      materialGramos: state.materialGramos,
      mermaPct: state.mermaPct,
      costoFijo: state.costoFijo,
      precioLuz: state.precioLuz,
      tiempo: getCurrentTimeString(),
      impresoraId: modelId,
      potenciaW: state.potenciaW,
      consumoExtraW: state.consumoExtraW,
      decimales: state.decimales,
      potenciaTotalW: String(Math.round(state.lastCalc.inputs.potenciaTotalW)),
    }
    persistHistory([{ id, ts: Date.now(), modelId, modelName, inputs: inputsSnapshot, outputs: state.lastCalc.outputs }, ...state.history].slice(0, 200))
    setEstado('Guardado', 'ok')
  }

  function loadHistoryItem(id) {
    const item = state.history.find((h) => h.id === id)
    if (!item) return
    const i = item.inputs || {}

    state.precioMaterial = i.precioMaterial ?? ''
    state.materialGramos = i.materialGramos ?? ''
    state.mermaPct = i.mermaPct ?? '10'
    state.costoFijo = i.costoFijo ?? '0'
    state.precioLuz = i.precioLuz ?? ''

    const t = parseTimeHHMM(i.tiempo)
    if (t) {
      state.tiempoHoras = String(t.hh)
      state.tiempoMinutos = pad2(t.mm)
    } else {
      state.tiempoHoras = '0'
      state.tiempoMinutos = '00'
    }

    state.consumoExtraW = i.consumoExtraW ?? '0'
    state.decimales = String(i.decimales ?? '0')

    if (i.impresoraId && state.models.some((m) => m.id === i.impresoraId)) {
      state.impresoraId = i.impresoraId
    }
    state.potenciaW = i.potenciaW ?? ''

    state.lastCalc = {
      ok: true,
      inputs: {
        precioMaterial: Number(i.precioMaterial),
        materialGramos: Number(i.materialGramos),
        mermaPct: Number(i.mermaPct),
        costoFijo: Number(i.costoFijo),
        precioLuz: Number(i.precioLuz),
        potenciaW: Number(i.potenciaW),
        consumoExtraW: Number(i.consumoExtraW),
        potenciaTotalW: Number(i.potenciaTotalW ?? Number(i.potenciaW) + Number(i.consumoExtraW || 0)),
        decimales: Number(i.decimales ?? 0),
        tiempo: parseTimeHHMM(i.tiempo) || { hh: 0, mm: 0, hours: 0, raw: '00:00' },
      },
      outputs: item.outputs,
    }
    state.dirty = false
    setEstado('Cargado', 'ok')
    setActiveTab('entradas')
  }

  function deleteHistoryItem(id) {
    if (!confirm('¿Borrar este registro del historial?')) return
    persistHistory(state.history.filter((h) => h.id !== id))
  }

  function clearHistory() {
    if (!state.history.length) return
    if (!confirm('¿Limpiar todo el historial?')) return
    persistHistory([])
  }

  // Reset
  function resetValues() {
    state.precioMaterial = ''
    state.materialGramos = ''
    state.mermaPct = '10'
    state.costoFijo = '0'
    state.precioLuz = '220'
    state.tiempoHoras = '0'
    state.tiempoMinutos = '00'
    state.potenciaW = ''
    state.consumoExtraW = '0'
    state.decimales = '0'
    clearAllErrors()
    state.lastCalc = null
    state.dirty = false
    setEstado('Listo', 'warn')
    syncPowerFromSelectedModel()
  }

  return {
    state,
    init,
    setActiveTab,
    markDirty,
    clearAllErrors,
    setEstado,
    startEditModel,
    setModelFormMode,
    saveModel,
    deleteModelWithConfirm,
    restoreModelsWithConfirm,
    onImpresoraChange,
    syncPowerFromSelectedModel,
    selectedModelName,
    recalcManual,
    recalcAuto,
    copyBreakdown,
    saveCurrentCalcToHistory,
    loadHistoryItem,
    deleteHistoryItem,
    clearHistory,
    resetValues,
  }
}
