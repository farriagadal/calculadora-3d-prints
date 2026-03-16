<template>
  <div role="tabpanel">
    <div class="sectionTitle">
      <span>Historial</span>
      <small>localStorage</small>
    </div>

    <div class="formGrid">
      <div class="field" style="grid-column: span 12">
        <div class="rowActions" style="justify-content: flex-start">
          <button class="btn btnSmall btnGhost" type="button" @click="store.clearHistory()">Limpiar historial</button>
        </div>
        <div class="note">Aquí se guardan los cálculos que presiones en "Guardar" (no se sube nada a internet).</div>
      </div>

      <div class="field" style="grid-column: span 12">
        <table class="modelsTable" aria-label="Historial de cálculos">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Modelo</th>
              <th>Total</th>
              <th style="width: 260px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!sortedHistory.length">
              <td colspan="4" style="color: rgba(255,255,255,0.72)">
                Sin historial todavía. Calcula y presiona "Guardar".
              </td>
            </tr>
            <tr v-for="item in sortedHistory" :key="item.id">
              <td>{{ formatDateTime(item.ts) }}</td>
              <td>{{ item.modelName || '—' }}</td>
              <td style="font-family: var(--mono)">
                {{ formatCLP(Number(item.outputs?.total), Number(item.inputs?.decimales ?? 0)) }}
              </td>
              <td style="display: flex; gap: 8px; flex-wrap: wrap">
                <button class="btn btnSmall" type="button" @click="store.loadHistoryItem(item.id)">Cargar</button>
                <button class="btn btnSmall btnDanger" type="button" @click="store.deleteHistoryItem(item.id)">
                  Borrar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
