<template>
  <div role="tabpanel">
    <div class="sectionTitle">
      <span>Formato de salida</span>
      <small>CLP</small>
    </div>

    <div class="formGrid">
      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label for="decimales">Decimales en CLP</label>
          <span class="hint">recomendado: 0</span>
        </div>
        <select id="decimales" v-model="state.decimales" @change="store.markDirty()">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        <div class="errorText">{{ state.errors.decimales }}</div>
      </div>

      <div class="field" style="grid-column: span 6">
        <div class="labelRow">
          <label>Acciones</label>
          <span class="hint">WhatsApp / IG</span>
        </div>
        <div class="rowActions" style="justify-content: flex-start">
          <button class="btn btnSmall" type="button" @click="store.copyBreakdown()">Copiar desglose</button>
          <button class="btn btnSmall btnGhost" type="button" @click="store.clearAllErrors()">Limpiar errores</button>
        </div>
        <div class="errorText">{{ state.errors.copiar }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()
const { state } = store
</script>
