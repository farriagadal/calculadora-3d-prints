<template>
  <section class="panel" aria-label="Entradas">
    <div class="panelHeader">
      <div class="tabs" role="tablist" aria-label="Pestañas">
        <button
          class="tabBtn"
          type="button"
          role="tab"
          :aria-selected="String(state.activeTab === 'entradas')"
          @click="store.setActiveTab('entradas')"
        >
          Entradas
        </button>
        <button
          class="tabBtn"
          type="button"
          role="tab"
          :aria-selected="String(state.activeTab === 'formato')"
          @click="store.setActiveTab('formato')"
        >
          Formato de salida
        </button>
        <button
          class="tabBtn"
          type="button"
          role="tab"
          :aria-selected="String(state.activeTab === 'perfiles')"
          @click="store.setActiveTab('perfiles')"
        >
          Perfiles de impresora
        </button>
        <button
          class="tabBtn"
          type="button"
          role="tab"
          :aria-selected="String(state.activeTab === 'historial')"
          @click="store.setActiveTab('historial')"
        >
          Historial
        </button>
      </div>
      <div class="rowActions">
        <button class="btn btnGhost btnSmall" type="button" @click="store.resetValues()">Resetear valores</button>
      </div>
    </div>

    <div class="panelBody">
      <InputsTab v-show="state.activeTab === 'entradas'" />
      <OutputTab v-show="state.activeTab === 'formato'" />
      <ModelsTab v-show="state.activeTab === 'perfiles'" />
      <HistoryTab v-show="state.activeTab === 'historial'" />
    </div>
  </section>
</template>

<script setup>
import { useAppStore } from '../stores/useAppStore.js'
import InputsTab from './InputsTab.vue'
import OutputTab from './OutputTab.vue'
import ModelsTab from './ModelsTab.vue'
import HistoryTab from './HistoryTab.vue'

const store = useAppStore()
const { state } = store
</script>
