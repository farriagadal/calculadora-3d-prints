<template>
  <div role="tabpanel">
    <div class="sectionTitle">
      <span>Material</span>
      <small>CLP/kg · gramos · merma</small>
    </div>

    <div class="formGrid">
      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label for="precioMaterial">Precio material (CLP/kg)</label>
          <span class="hint">Ej: 16990</span>
        </div>
        <input
          id="precioMaterial"
          v-model="state.precioMaterial"
          type="number"
          inputmode="numeric"
          min="0"
          step="1"
          placeholder="CLP por kg"
          @input="store.markDirty()"
          @change="store.markDirty()"
        />
        <div class="errorText">{{ state.errors.precioMaterial }}</div>
      </div>

      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label for="materialGramos">Material usado (g)</label>
          <span class="hint">Ej: 120</span>
        </div>
        <input
          id="materialGramos"
          v-model="state.materialGramos"
          type="number"
          inputmode="decimal"
          min="0"
          step="0.1"
          placeholder="Gramos"
          @input="store.markDirty()"
          @change="store.markDirty()"
        />
        <div class="errorText">{{ state.errors.materialGramos }}</div>
      </div>

      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label for="mermaPct">Merma / desperdicio (%)</label>
          <span class="hint">Sugerido: 10%</span>
        </div>
        <input
          id="mermaPct"
          v-model="state.mermaPct"
          type="number"
          inputmode="decimal"
          min="0"
          step="0.1"
          placeholder="%"
          @input="store.markDirty()"
          @change="store.markDirty()"
        />
        <div class="errorText">{{ state.errors.mermaPct }}</div>
      </div>

      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label for="costoFijo">Costo fijo (CLP) (opcional)</label>
          <span class="hint">IPA, cinta, pegamento…</span>
        </div>
        <input
          id="costoFijo"
          v-model="state.costoFijo"
          type="number"
          inputmode="numeric"
          min="0"
          step="1"
          placeholder="0"
          @input="store.markDirty()"
          @change="store.markDirty()"
        />
        <div class="errorText">{{ state.errors.costoFijo }}</div>
      </div>
    </div>

    <div class="sectionTitle">
      <span>Electricidad</span>
      <small>CLP/kWh · hh:mm · potencia</small>
    </div>

    <div class="formGrid">
      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label for="precioLuz">Precio luz (CLP/kWh)</label>
          <span class="hint">Revísalo en tu boleta</span>
        </div>
        <input
          id="precioLuz"
          v-model="state.precioLuz"
          type="number"
          inputmode="decimal"
          min="0"
          step="0.1"
          placeholder="CLP/kWh"
          @input="store.markDirty()"
          @change="store.markDirty()"
        />
        <div class="errorText">{{ state.errors.precioLuz }}</div>
      </div>

      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label>Tiempo de impresión (hh:mm)</label>
          <span class="hint">Ej: 05:30</span>
        </div>
        <div class="timePicker" aria-label="Selector de tiempo (hh:mm)">
          <div class="timePart">
            <label class="hint" for="tiempoHoras">Horas</label>
            <select id="tiempoHoras" v-model="state.tiempoHoras" @change="store.markDirty()">
              <option v-for="h in 201" :key="h - 1" :value="String(h - 1)">{{ h - 1 }}</option>
            </select>
          </div>
          <span class="sep">:</span>
          <div class="timePart">
            <label class="hint" for="tiempoMinutos">Minutos</label>
            <select id="tiempoMinutos" v-model="state.tiempoMinutos" @change="store.markDirty()">
              <option v-for="m in 60" :key="m - 1" :value="pad2(m - 1)">{{ pad2(m - 1) }}</option>
            </select>
          </div>
        </div>
        <div class="errorText">{{ state.errors.tiempo }}</div>
      </div>

      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label for="impresora">Impresora (modelo)</label>
          <span class="hint">perfil guardado</span>
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
          <label for="potenciaW">Potencia promedio (W)</label>
          <span class="hint">editable</span>
        </div>
        <input
          id="potenciaW"
          v-model="state.potenciaW"
          type="number"
          inputmode="decimal"
          min="0"
          step="1"
          placeholder="W"
          @input="store.markDirty()"
          @change="store.markDirty()"
        />
        <div class="errorText">{{ state.errors.potenciaW }}</div>
      </div>

      <div class="field" style="grid-column: span 3">
        <div class="labelRow">
          <label for="consumoExtraW">Consumo extra (W)</label>
          <span class="hint">secador, etc.</span>
        </div>
        <input
          id="consumoExtraW"
          v-model="state.consumoExtraW"
          type="number"
          inputmode="decimal"
          min="0"
          step="1"
          placeholder="0"
          @input="store.markDirty()"
          @change="store.markDirty()"
        />
        <div class="errorText">{{ state.errors.consumoExtraW }}</div>
      </div>
    </div>

    <p class="note">
      Nota: la <b>fuente</b> de la impresora puede ser, por ejemplo, de 400W, pero el <b>consumo promedio real</b>
      suele ser menor y depende del perfil (temperaturas, velocidad, cama, ventiladores). Si tienes un medidor (enchufe
      inteligente / wattímetro), ajusta este valor.
    </p>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()
const { state } = store

function pad2(n) {
  return String(n).padStart(2, '0')
}
</script>
