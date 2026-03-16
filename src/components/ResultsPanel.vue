<template>
  <aside class="panel resultsPanel" id="resultsPanel" aria-label="Resultados">
    <div class="panelBody">
      <!-- Empty state -->
      <div v-if="!state.lastCalc" class="emptyState">
        <div class="emptyTitle">{{ t('emptyTitle') }}</div>
        <ul class="emptyChecklist">
          <li :class="{ checked: !!state.precioMaterial }">{{ t('emptyItem1') }} ({{ localeState.currency }}/kg)</li>
          <li :class="{ checked: !!state.materialGramos }">{{ t('emptyItem2') }}</li>
          <li :class="{ checked: !!state.precioLuz }">{{ t('emptyItem3') }} ({{ localeState.currency }}/kWh)</li>
          <li :class="{ checked: tiempoFilled }">{{ t('emptyItem4') }}</li>
        </ul>
        <p class="emptyHint">{{ t('emptyHint') }}</p>
      </div>

      <!-- Resultados -->
      <div v-else class="resultsTop">
        <div class="totalCard">
          <div class="totalRow">
            <div>
              <div class="totalLabel">{{ t('totalLabel') }}</div>
              <div class="hint">{{ totalSub }}</div>
            </div>
            <div class="totalValue" :class="{ flashTotal: flashTotal }">{{ totalFmt }}</div>
          </div>

          <div class="margenRow">
            <label class="hint" for="margenPct">{{ t('margenLabel') }}</label>
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
              {{ t('precioVentaPrefix') }} <strong>{{ precioVentaFmt }}</strong>
            </div>
          </div>

          <div class="decimalsRow">
            <label class="hint" for="decimalesResult">{{ t('decimalesLabel') }}</label>
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
              :title="`${t('rowMaterial')}: ${materialPct.toFixed(1)}%`"
            ></div>
            <div
              class="costBarSeg segLuz"
              :style="{ width: luzPct + '%' }"
              :title="`${t('rowElectricidad')}: ${luzPct.toFixed(1)}%`"
            ></div>
            <div
              class="costBarSeg segFijo"
              :style="{ width: fijoPct + '%' }"
              :title="`${t('rowCostoFijo')}: ${fijoPct.toFixed(1)}%`"
            ></div>
          </div>
          <div class="costBarLegend">
            <span class="legendItem">
              <span class="legendDot dotMaterial"></span>{{ t('rowMaterial') }} {{ materialPct.toFixed(0) }}%
            </span>
            <span class="legendItem">
              <span class="legendDot dotLuz"></span>{{ t('rowElectricidad') }} {{ luzPct.toFixed(0) }}%
            </span>
            <span v-if="fijoPct > 0.5" class="legendItem">
              <span class="legendDot dotFijo"></span>{{ t('rowCostoFijo') }} {{ fijoPct.toFixed(0) }}%
            </span>
          </div>
        </div>

        <div class="breakdown">
          <div class="itemRow">
            <span>{{ t('rowMaterial') }}</span>
            <span>{{ costoMaterialFmt }}</span>
          </div>
          <div class="itemRow">
            <span>{{ t('rowElectricidad') }}</span>
            <span>{{ costoLuzFmt }}</span>
          </div>
          <div class="itemRow">
            <span>{{ t('rowCostoFijo') }}</span>
            <span>{{ costoFijoFmt }}</span>
          </div>
          <div class="divider"></div>
          <div class="itemRow">
            <span>{{ t('rowKwh') }}</span>
            <span>{{ kWh }}</span>
          </div>
          <div class="itemRow">
            <span>{{ t('rowGramosConMerma') }}</span>
            <span>{{ gramosConMerma }}</span>
          </div>
          <div class="itemRow">
            <span>{{ t('rowPotenciaTotal') }}</span>
            <span>{{ potenciaTotal }}</span>
          </div>
          <div class="itemRow">
            <span>{{ t('rowTiempo') }}</span>
            <span>{{ tiempoFmt }}</span>
          </div>
        </div>

        <div class="bottomActions">
          <button class="btn btnPrimary copyBtnFull" type="button" @click="store.copyBreakdown()">
            {{ t('btnCopiar') }}
          </button>
          <button class="btn btnSmall" type="button" @click="store.saveCurrentCalcToHistory()">{{ t('btnGuardar') }}</button>
        </div>
      </div>

      <div class="errorText" v-if="state.errors.copiar">{{ state.errors.copiar }}</div>

      <p class="note" v-html="t('noteResultados')"></p>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAppStore } from '../stores/useAppStore.js'
import { useLocaleStore, formatAmount } from '../stores/useLocaleStore.js'

const store = useAppStore()
const { state } = store
const { localeState, t } = useLocaleStore()

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

const d = computed(() => {
  if (state.lastCalc) return state.lastCalc.inputs.decimales
  return Number(state.decimales ?? 0)
})

const totalFmt = computed(() =>
  state.lastCalc ? formatAmount(state.lastCalc.outputs.total, d.value) : formatAmount(0, d.value)
)
const costoMaterialFmt = computed(() =>
  state.lastCalc ? formatAmount(state.lastCalc.outputs.costoMaterial, d.value) : formatAmount(0, d.value)
)
const costoLuzFmt = computed(() =>
  state.lastCalc ? formatAmount(state.lastCalc.outputs.costoLuz, d.value) : formatAmount(0, d.value)
)
const costoFijoFmt = computed(() =>
  state.lastCalc ? formatAmount(state.lastCalc.inputs.costoFijo, d.value) : formatAmount(0, d.value)
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
  return `${store.selectedModelName()} · ${c.inputs.materialGramos.toFixed(1)} g · ${c.inputs.tiempo.raw}`
})

const precioVenta = computed(() => {
  if (!state.lastCalc) return null
  const m = Number(margenPctVal.value)
  if (!Number.isFinite(m) || m < 0) return null
  return state.lastCalc.outputs.total * (1 + m / 100)
})

const precioVentaFmt = computed(() =>
  precioVenta.value !== null ? formatAmount(precioVenta.value, d.value) : ''
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

<style scoped>
.bottomActions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.bottomActions .copyBtnFull {
  flex: 1;
}
</style>
