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
          {{ t('tabEntradas') }}
        </button>
        <button
          class="tabBtn"
          type="button"
          role="tab"
          :aria-selected="String(state.activeTab === 'perfiles')"
          @click="store.setActiveTab('perfiles')"
        >
          {{ t('tabPerfiles') }}
        </button>
        <button
          class="tabBtn"
          type="button"
          role="tab"
          :aria-selected="String(state.activeTab === 'historial')"
          @click="store.setActiveTab('historial')"
        >
          {{ t('tabHistorial') }}
        </button>
      </div>
      <div class="rowActions">
        <button class="tabBtn" type="button" @click="store.resetValues()">{{ t('resetValues') }}</button>
      </div>
    </div>

    <div class="panelBody" style="padding: 10px 25px 25px;">
      <Transition name="tabFade" mode="out-in">
        <InputsTab v-if="state.activeTab === 'entradas'" key="entradas" />
        <ModelsTab v-else-if="state.activeTab === 'perfiles'" key="perfiles" />
        <HistoryTab v-else-if="state.activeTab === 'historial'" key="historial" />
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { useAppStore } from '../stores/useAppStore.js'
import { useLocaleStore } from '../stores/useLocaleStore.js'
import InputsTab from './InputsTab.vue'
import ModelsTab from './ModelsTab.vue'
import HistoryTab from './HistoryTab.vue'

const store = useAppStore()
const { state } = store
const { t } = useLocaleStore()
</script>
