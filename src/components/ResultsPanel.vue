<template>
  <aside class="panel" aria-label="Resultados">
    <div class="panelHeader">
      <h2>Resultados</h2>
      <div class="rowActions">
        <button class="btn btnPrimary btnSmall" type="button" @click="store.recalcManual()">Calcular</button>
        <button class="btn btnSmall" type="button" @click="store.saveCurrentCalcToHistory()">Guardar</button>
        <div class="pill" :style="estadoStyle">{{ state.estadoText }}</div>
      </div>
    </div>

    <div class="panelBody">
      <div class="resultsTop">
        <div class="totalCard">
          <div class="totalRow">
            <div>
              <div class="totalLabel">Total estimado</div>
              <div class="hint">{{ totalSub }}</div>
            </div>
            <div class="totalValue">{{ totalCLP }}</div>
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
      </div>

      <p class="note">
        Este cálculo es una <b>estimación</b>. Si quieres afinar la electricidad, mide el consumo promedio real de tu
        impresora (W) durante una impresión típica.
      </p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore, formatCLP } from '../stores/useAppStore.js'

const store = useAppStore()
const { state } = store

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
  if (!state.lastCalc) return 'Completa los campos para calcular'
  const c = state.lastCalc
  return `Modelo: ${store.selectedModelName()} · Material: ${c.inputs.materialGramos.toFixed(1)} g · Luz: ${c.inputs.tiempo.raw}`
})
</script>
