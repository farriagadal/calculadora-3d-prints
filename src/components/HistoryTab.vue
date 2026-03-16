<template>
  <div role="tabpanel">

    <div class="formGrid">
      <div style="grid-column: span 12">
        <div class="rowActions" style="justify-content: flex-start;margin: 15px 0">
          <button class="btn btnSmall btnGhost" type="button" @click="store.clearHistory()">{{ t('btnLimpiarHistorial') }}</button>
        </div>
        <div class="note">{{ t('noteHistorial') }}</div>
      </div>

      <div style="grid-column: span 12">
        <div v-if="!sortedHistory.length" class="emptyHistory">
          {{ t('emptyHistory') }}
        </div>
        <div v-else class="historyList">
          <div v-for="item in sortedHistory" :key="item.id" class="historyCard">
            <div class="historyCardMain">
              <div class="historyInfo">
                <span class="historyTotal">{{ formatAmount(Number(item.outputs?.total), Number(item.inputs?.decimales ?? 0)) }}</span>
                <span class="historyModel">{{ item.modelName || '—' }}</span>
              </div>
              <div class="historyMeta">
                <span>{{ formatDateTime(item.ts) }}</span>
                <span v-if="item.inputs?.materialGramos">· {{ Number(item.inputs.materialGramos).toFixed(1) }} g</span>
                <span v-if="item.inputs?.tiempo">· {{ item.inputs.tiempo }}</span>
              </div>
            </div>
            <div class="historyActions">
              <button class="btn btnSmall" type="button" @click="store.loadHistoryItem(item.id)">{{ t('btnCargar') }}</button>
              <button class="btn btnSmall btnDanger" type="button" @click="store.deleteHistoryItem(item.id)">{{ t('btnBorrar') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore, formatDateTime } from '../stores/useAppStore.js'
import { useLocaleStore, formatAmount } from '../stores/useLocaleStore.js'

const store = useAppStore()
const { state } = store
const { t } = useLocaleStore()

const sortedHistory = computed(() => [...state.history].sort((a, b) => b.ts - a.ts))
</script>
