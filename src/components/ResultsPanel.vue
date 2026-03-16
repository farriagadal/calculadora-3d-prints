<template>
  <aside class="panel resultsPanel" id="resultsPanel" aria-label="Resultados">
    <div class="panelHeader">
      <h2>Resultados</h2>
      <div class="rowActions">
        <button class="btn btnPrimary btnSmall" type="button" @click="store.recalcManual()">Calcular</button>
        <button class="btn btnSmall" type="button" @click="store.saveCurrentCalcToHistory()">Guardar</button>
        <button
          class="btn btnSmall"
          type="button"
          @click="store.copyBreakdown()"
          title="Copiar desglose para cotización"
        >
          Copiar
        </button>
        <div class="pill" :style="estadoStyle">{{ state.estadoText }}</div>
      </div>
    </div>

    <div class="panelBody">
      <!-- Empty state -->
      <div v-if="!state.lastCalc" class="emptyState">
        <div class="emptyTitle">Completa los campos para calcular</div>
        <ul class="emptyChecklist">
          <li :class="{ checked: !!state.precioMaterial }">Precio material (CLP/kg)</li>
          <li :class="{ checked: !!state.materialGramos }">Material usado (g)</li>
          <li :class="{ checked: !!state.precioLuz }">Precio electricidad (CLP/kWh)</li>
          <li :class="{ checked: tiempoFilled }">Tiempo de impresión</li>
        </ul>
        <p class="emptyHint">Se calcula automáticamente al completar los campos</p>
      </div>

      <!-- Resultados -->
      <div v-else class="resultsTop">
        <div class="totalCard">
          <div class="totalRow">
            <div>
              <div class="totalLabel">Costo estimado</div>
              <div class="hint">{{ totalSub }}</div>
            </div>
            <div class="totalValue" :class="{ flashTotal: flashTotal }">{{ totalCLP }}</div>
          </div>

          <div class="margenRow">
            <label class="hint" for="margenPct">Margen</label>
            <div class="margenInput">
              <input
                id="margenPct"
                v-model="margenPctVal"
                type="number"
                inputmode="decimal"
                min="0"
                max="999"
                step="1"
                placeholder="30"
                class="margenField"
              />
              <span class="hint">%</span>
            </div>
            <div class="ventaValue" v-if="precioVenta !== null">
              → Precio venta: <strong>{{ precioVentaCLP }}</strong>
            </div>
          </div>

          <div class="decimalsRow">
            <label class="hint" for="decimalesResult">Decimales</label>
            <select id="decimalesResult" v-model="state.decimales" class="decimalesSelect" @change="store.markDirty()">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
        </div>

        <div class="costBarWrap" v-if="state.lastCalc.outputs.total > 0">
          <div class="costBar">
            <div
              class="costBarSeg segMaterial"
              :style="{ width: materialPct + '%' }"
              :title="`Material: ${materialPct.toFixed(1)}%`"
            ></div>
            <div
              class="costBarSeg segLuz"
              :style="{ width: luzPct + '%' }"
              :title="`Electricidad: ${luzPct.toFixed(1)}%`"
            ></div>
            <div
              class="costBarSeg segFijo"
              :style="{ width: fijoPct + '%' }"
              :title="`Costo fijo: ${fijoPct.toFixed(1)}%`"
            ></div>
          </div>
          <div class="costBarLegend">
            <span class="legendItem">
              <span class="legendDot dotMaterial"></span>Material {{ materialPct.toFixed(0) }}%
            </span>
            <span class="legendItem">
              <span class="legendDot dotLuz"></span>Luz {{ luzPct.toFixed(0) }}%
            </span>
            <span v-if="fijoPct > 0.5" class="legendItem">
              <span class="legendDot dotFijo"></span>Fijo {{ fijoPct.toFixed(0) }}%
            </span>
          </div>
        </div>

        <div class="breakdown">
          <div class="itemRow">
            <span>Material</span>
            <span>{{ costoMaterialCLP }}</span>
          </div>
          <div class="itemRow">
            <span>Electricidad</span>
            <span>{{ costoLuzCLP }}</span>
          </div>
          <div class="itemRow">
            <span>Costo fijo</span>
            <span>{{ costoFijoCLP }}</span>
          </div>
          <div class="divider"></div>
          <div class="itemRow">
            <span>kWh estimados</span>
            <span>{{ kWh }}</span>
          </div>
          <div class="itemRow">
            <span>Material con merma</span>
            <span>{{ gramosConMerma }}</span>
          </div>
          <div class="itemRow">
            <span>Potencia total</span>
            <span>{{ potenciaTotal }}</span>
          </div>
          <div class="itemRow">
            <span>Tiempo</span>
            <span>{{ tiempoFmt }}</span>
          </div>
        </div>

        <button class="btn btnPrimary copyBtnFull" type="button" @click="store.copyBreakdown()">
          Copiar desglose para cotización
        </button>
      </div>

      <div class="errorText" v-if="state.errors.copiar">{{ state.errors.copiar }}</div>

      <p class="note">
        Este cálculo es una <b>estimación</b>. Si quieres afinar la electricidad, mide el consumo promedio real de tu
        impresora (W) durante una impresión típica.
      </p>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAppStore, formatCLP } from '../stores/useAppStore.js'

const store = useAppStore()
const { state } = store

const flashTotal = ref(false)

const margenPctVal = computed({
  get: () => state.margenPct,
  set: (v) => store.setMargenPct(v),
})

const tiempoFilled = computed(() => Number(state.tiempoHoras) > 0 || Number(state.tiempoMinutos) > 0)

watch(() => state.lastCalc?.outputs?.total, (newVal, oldVal) => {
  if (newVal !== undefined && newVal !== oldVal) {
    flashTotal.value = true
    setTimeout(() => { flashTotal.value = false }, 600)
  }
})

const estadoStyle = computed(() => {
  const k = state.estadoKind
  if (k === 'ok') return { borderColor: 'rgba(35, 197, 94, 0.45)', background: 'rgba(35, 197, 94, 0.12)' }
  if (k === 'bad') return { borderColor: 'rgba(255, 77, 95, 0.45)', background: 'rgba(255, 77, 95, 0.12)' }
  if (k === 'warn') return { borderColor: 'rgba(255, 176, 32, 0.5)', background: 'rgba(255, 176, 32, 0.12)' }
  return { borderColor: 'rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.06)' }
})

const d = computed(() => {
  if (state.lastCalc) return state.lastCalc.inputs.decimales
  return Number(state.decimales ?? 0)
})

const totalCLP = computed(() =>
  state.lastCalc ? formatCLP(state.lastCalc.outputs.total, d.value) : formatCLP(0, d.value)
)
const costoMaterialCLP = computed(() =>
  state.lastCalc ? formatCLP(state.lastCalc.outputs.costoMaterial, d.value) : formatCLP(0, d.value)
)
const costoLuzCLP = computed(() =>
  state.lastCalc ? formatCLP(state.lastCalc.outputs.costoLuz, d.value) : formatCLP(0, d.value)
)
const costoFijoCLP = computed(() =>
  state.lastCalc ? formatCLP(state.lastCalc.inputs.costoFijo, d.value) : formatCLP(0, d.value)
)
const kWh = computed(() => (state.lastCalc ? state.lastCalc.outputs.kWh.toFixed(3) : '0.000'))
const gramosConMerma = computed(() =>
  state.lastCalc ? `${state.lastCalc.outputs.gramosConMerma.toFixed(1)} g` : '0.0 g'
)
const potenciaTotal = computed(() =>
  state.lastCalc ? `${Math.round(state.lastCalc.inputs.potenciaTotalW)} W` : '0 W'
)
const tiempoFmt = computed(() => (state.lastCalc ? state.lastCalc.inputs.tiempo.raw : '00:00'))

const totalSub = computed(() => {
  if (!state.lastCalc) return ''
  const c = state.lastCalc
  return `Modelo: ${store.selectedModelName()} · Material: ${c.inputs.materialGramos.toFixed(1)} g · Luz: ${c.inputs.tiempo.raw}`
})

const precioVenta = computed(() => {
  if (!state.lastCalc) return null
  const m = Number(margenPctVal.value)
  if (!Number.isFinite(m) || m < 0) return null
  return state.lastCalc.outputs.total * (1 + m / 100)
})

const precioVentaCLP = computed(() =>
  precioVenta.value !== null ? formatCLP(precioVenta.value, d.value) : ''
)

const materialPct = computed(() => {
  if (!state.lastCalc || state.lastCalc.outputs.total <= 0) return 0
  return (state.lastCalc.outputs.costoMaterial / state.lastCalc.outputs.total) * 100
})

const luzPct = computed(() => {
  if (!state.lastCalc || state.lastCalc.outputs.total <= 0) return 0
  return (state.lastCalc.outputs.costoLuz / state.lastCalc.outputs.total) * 100
})

const fijoPct = computed(() => {
  if (!state.lastCalc || state.lastCalc.outputs.total <= 0) return 0
  return (state.lastCalc.inputs.costoFijo / state.lastCalc.outputs.total) * 100
})
</script>
