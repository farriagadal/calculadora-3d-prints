<template>
  <div role="tabpanel">
    <div class="sectionTitle">
      <span>Historial</span>
      <small>guardado localmente</small>
    </div>

    <div class="formGrid">
      <div class="field" style="grid-column: span 12">
        <div class="rowActions" style="justify-content: flex-start">
          <button class="btn btnSmall btnGhost" type="button" @click="store.clearHistory()">Limpiar historial</button>
        </div>
        <div class="note">Aquí se guardan los cálculos que presiones en "Guardar" (no se sube nada a internet).</div>
      </div>

      <div class="field" style="grid-column: span 12">
        <div v-if="!sortedHistory.length" class="emptyHistory">
          Sin historial todavía. Calcula y presiona "Guardar".
        </div>
        <div v-else class="historyList">
          <div v-for="item in sortedHistory" :key="item.id" class="historyCard">
            <div class="historyCardMain">
              <div class="historyInfo">
                <span class="historyTotal">{{ formatCLP(Number(item.outputs?.total), Number(item.inputs?.decimales ?? 0)) }}</span>
                <span class="historyModel">{{ item.modelName || '—' }}</span>
              </div>
              <div class="historyMeta">
                <span>{{ formatDateTime(item.ts) }}</span>
                <span v-if="item.inputs?.materialGramos">· {{ Number(item.inputs.materialGramos).toFixed(1) }} g</span>
                <span v-if="item.inputs?.tiempo">· {{ item.inputs.tiempo }}</span>
              </div>
            </div>
            <div class="historyActions">
              <button class="btn btnSmall" type="button" @click="store.loadHistoryItem(item.id)">Cargar</button>
              <button class="btn btnSmall btnDanger" type="button" @click="store.deleteHistoryItem(item.id)">Borrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore, formatCLP, formatDateTime } from '../stores/useAppStore.js'

const store = useAppStore()
const { state } = store

const sortedHistory = computed(() => [...state.history].sort((a, b) => b.ts - a.ts))
</script>
