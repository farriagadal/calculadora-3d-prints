<template>
  <div role="tabpanel">

    <!-- ── Campos básicos ── -->
    <div class="formGrid">
      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label for="precioMaterial">Precio del filamento</label>
          <span class="hint">Ej: $16.990 / kg</span>
        </div>
        <div class="inputWithSuffix">
          <input
            id="precioMaterial"
            v-model="state.precioMaterial"
            type="number"
            inputmode="numeric"
            min="0"
            step="1"
            placeholder="0"
            :class="{ inputFilled: !!state.precioMaterial }"
            @input="store.markDirty()"
            @change="store.markDirty()"
          />
          <span class="inputSuffix">CLP/kg</span>
        </div>
        <div class="errorText">{{ state.errors.precioMaterial }}</div>
      </div>

      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label for="materialGramos">Material a usar</label>
          <span class="hint">Ej: 120 g (del slicer)</span>
        </div>
        <div class="inputWithSuffix">
          <input
            id="materialGramos"
            v-model="state.materialGramos"
            type="number"
            inputmode="decimal"
            min="0"
            step="0.1"
            placeholder="0"
            :class="{ inputFilled: !!state.materialGramos }"
            @input="store.markDirty()"
            @change="store.markDirty()"
          />
          <span class="inputSuffix">g</span>
        </div>
        <div class="errorText">{{ state.errors.materialGramos }}</div>
      </div>

      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label for="precioLuz">Precio de la electricidad</label>
          <span class="hint">Revísalo en tu boleta</span>
        </div>
        <div class="inputWithSuffix">
          <input
            id="precioLuz"
            v-model="state.precioLuz"
            type="number"
            inputmode="decimal"
            min="0"
            step="0.1"
            placeholder="220"
            :class="{ inputFilled: !!state.precioLuz }"
            @input="store.markDirty()"
            @change="store.markDirty()"
          />
          <span class="inputSuffix">CLP/kWh</span>
        </div>
        <div class="errorText">{{ state.errors.precioLuz }}</div>
      </div>

      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label>Tiempo de impresión</label>
          <span class="hint">Del slicer (hh:mm)</span>
        </div>
        <div class="timePicker" aria-label="Selector de tiempo (hh:mm)">
          <div class="timePart">
            <select id="tiempoHoras" v-model="state.tiempoHoras" @change="store.markDirty()">
              <option v-for="h in 201" :key="h - 1" :value="String(h - 1)">{{ h - 1 }}</option>
            </select>
          </div>
          <span class="sep">:</span>
          <div class="timePart">
            <select id="tiempoMinutos" v-model="state.tiempoMinutos" @change="store.markDirty()">
              <option v-for="m in 60" :key="m - 1" :value="pad2(m - 1)">{{ pad2(m - 1) }}</option>
            </select>
          </div>
        </div>
        <div class="errorText">{{ state.errors.tiempo }}</div>
      </div>
    </div>

    <!-- ── Botón configuración avanzada ── -->
    <button class="tabBtn advancedToggle" type="button" @click="mostrarAvanzado = !mostrarAvanzado">
      <span class="advancedToggleIcon">{{ mostrarAvanzado ? '▾' : '▸' }}</span>
      Configuración avanzada
      <span v-if="tieneValoresAvanzados" class="advancedBadge">●</span>
    </button>

    <!-- ── Sección avanzada ── -->
    <div v-if="mostrarAvanzado" style="padding-top: 10px;"">

      <!-- Material avanzado -->
      <div class="sectionTitle">
        <div class="sectionLabel">
          <span class="sectionIcon">🧵</span>
          <span>Material</span>
          <span v-if="materialCompleto" class="sectionBadge sectionBadge--ok">✓ listo</span>
        </div>
        <small>Merma y costos adicionales</small>
      </div>

      <div class="formGrid">
        <div class="field" style="grid-column: span 6">
          <div class="labelRow">
            <label for="mermaPct">Merma / desperdicio</label>
            <span class="hint">Sugerido: 10%</span>
          </div>
          <div class="inputWithSuffix">
            <input
              id="mermaPct"
              v-model="state.mermaPct"
              type="number"
              inputmode="decimal"
              min="0"
              step="0.1"
              placeholder="10"
              :class="{ inputFilled: !!state.mermaPct }"
              @input="store.markDirty()"
              @change="store.markDirty()"
            />
            <span class="inputSuffix">%</span>
          </div>
          <div class="errorText">{{ state.errors.mermaPct }}</div>
        </div>

        <div class="field" style="grid-column: span 6">
          <div class="labelRow">
            <label for="costoFijo">Costos adicionales</label>
            <span class="labelRight">
              <span class="labelTag">opcional</span>
              <span class="hint">IPA, cinta, pegamento…</span>
            </span>
          </div>
          <div class="inputWithSuffix">
            <input
              id="costoFijo"
              v-model="state.costoFijo"
              type="number"
              inputmode="numeric"
              min="0"
              step="1"
              placeholder="0"
              :class="{ inputFilled: !!state.costoFijo && state.costoFijo !== '0' }"
              @input="store.markDirty()"
              @change="store.markDirty()"
            />
            <span class="inputSuffix">CLP</span>
          </div>
          <div class="errorText">{{ state.errors.costoFijo }}</div>
        </div>
      </div>

      <!-- Electricidad avanzada -->
      <div class="sectionTitle">
        <div class="sectionLabel">
          <span class="sectionIcon">⚡</span>
          <span>Electricidad</span>
          <span v-if="electricidadCompleto" class="sectionBadge sectionBadge--ok">✓ listo</span>
        </div>
        <small>Impresora y consumo</small>
      </div>

      <div class="formGrid">
        <div class="field" style="grid-column: span 6">
          <div class="labelRow">
            <label for="impresora">Impresora</label>
            <span class="hint">Carga el perfil de potencia</span>
          </div>
          <select id="impresora" v-model="state.impresoraId" @change="store.onImpresoraChange()">
            <option v-for="m in state.models" :key="m.id" :value="m.id">
              {{ m.nombre }}{{ m.builtin ? ' (por defecto)' : '' }}
            </option>
          </select>
          <div class="errorText">{{ state.errors.impresora }}</div>
        </div>

        <div class="field" style="grid-column: span 3">
          <div class="labelRow">
            <label for="potenciaW">Potencia promedio</label>
            <span class="hint">Del perfil · editable</span>
          </div>
          <div class="inputWithSuffix">
            <input
              id="potenciaW"
              v-model="state.potenciaW"
              type="number"
              inputmode="decimal"
              min="0"
              step="1"
              placeholder="0"
              :class="{ inputFilled: !!state.potenciaW }"
              @input="store.markDirty()"
              @change="store.markDirty()"
            />
            <span class="inputSuffix">W</span>
          </div>
          <div class="errorText">{{ state.errors.potenciaW }}</div>
        </div>

        <div class="field" style="grid-column: span 3">
          <div class="labelRow">
            <label for="consumoExtraW">Consumo extra</label>
            <span class="labelRight">
              <span class="labelTag">opcional</span>
              <span class="hint">Secador, cámara…</span>
            </span>
          </div>
          <div class="inputWithSuffix">
            <input
              id="consumoExtraW"
              v-model="state.consumoExtraW"
              type="number"
              inputmode="decimal"
              min="0"
              step="1"
              placeholder="0"
              :class="{ inputFilled: !!state.consumoExtraW && state.consumoExtraW !== '0' }"
              @input="store.markDirty()"
              @change="store.markDirty()"
            />
            <span class="inputSuffix">W</span>
          </div>
          <div class="errorText">{{ state.errors.consumoExtraW }}</div>
        </div>
      </div>

      <p class="note">
        💡 La <b>potencia promedio real</b> suele ser menor a la potencia máxima de la fuente. Depende de temperaturas,
        velocidad y ventiladores. Si tienes un enchufe inteligente o wattímetro, usa ese valor para mayor precisión.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()
const { state } = store

const mostrarAvanzado = ref(false)

function pad2(n) {
  return String(n).padStart(2, '0')
}

const tieneValoresAvanzados = computed(() =>
  (!!state.mermaPct && state.mermaPct !== '10') ||
  (!!state.costoFijo && state.costoFijo !== '0') ||
  (!!state.consumoExtraW && state.consumoExtraW !== '0')
)

const materialCompleto = computed(() =>
  !!state.precioMaterial && !!state.materialGramos && !!state.mermaPct
)

const electricidadCompleto = computed(() =>
  !!state.precioLuz &&
  !!state.potenciaW &&
  (Number(state.tiempoHoras) > 0 || Number(state.tiempoMinutos) > 0)
)
</script>

<style scoped>
.sectionLabel {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sectionIcon {
  font-size: 1rem;
  line-height: 1;
}

.sectionBadge {
  font-size: 0.73rem;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.sectionBadge--ok {
  background: rgba(35, 197, 94, 0.15);
  border: 1px solid rgba(35, 197, 94, 0.35);
  color: #23c55e;
}

.labelRight {
  display: flex;
  align-items: center;
  gap: 6px;
}

.labelTag {
  font-size: 0.72rem;
  padding: 1px 6px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.48);
  font-weight: 500;
  margin-left: 0;
}

.advancedToggle {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0 4px;
}

.advancedToggleIcon {
  font-size: 0.75rem;
  line-height: 1;
}

.advancedBadge {
  font-size: 0.55rem;
  color: #f59e0b;
  margin-left: 2px;
}
</style>
