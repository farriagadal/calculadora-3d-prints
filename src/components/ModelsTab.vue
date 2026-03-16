<template>
  <div role="tabpanel">
    <div class="sectionTitle">
      <span>{{ t('sectionPerfiles') }}</span>
      <small>localStorage</small>
    </div>

    <div class="formGrid">
      <div class="field" style="grid-column: span 8">
        <div class="labelRow">
          <label for="modeloNombre">{{ t('labelModeloNombre') }}</label>
          <span class="hint">{{ t('hintModeloNombre') }}</span>
        </div>
        <input id="modeloNombre" v-model="state.modeloNombre" type="text" :placeholder="t('labelModeloNombre')" />
        <div class="errorText">{{ state.errors.modeloNombre }}</div>
      </div>

      <div class="field" style="grid-column: span 4">
        <div class="labelRow">
          <label for="modeloPotenciaW">{{ t('labelModeloPotencia') }}</label>
          <span class="hint">Ej: 180</span>
        </div>
        <input
          id="modeloPotenciaW"
          v-model="state.modeloPotenciaW"
          type="number"
          inputmode="decimal"
          min="0"
          step="1"
          placeholder="W"
        />
        <div class="errorText">{{ state.errors.modeloPotenciaW }}</div>
      </div>

      <div class="field" style="grid-column: span 12">
        <div class="rowActions" style="justify-content: flex-start">
          <button class="btn btnSmall btnPrimary" type="button" @click="store.saveModel()">
            {{ state.editingModelId ? t('btnGuardarCambios') : t('btnGuardarModelo') }}
          </button>
          <button
            v-if="state.editingModelId"
            class="btn btnSmall btnGhost"
            type="button"
            @click="store.setModelFormMode('create')"
          >
            {{ t('btnCancelarEdicion') }}
          </button>
          <button class="btn btnSmall btnDanger" type="button" @click="store.restoreModelsWithConfirm()">
            {{ t('btnRestaurarModelos') }}
          </button>
        </div>
        <div class="note" v-html="t('noteModelos')"></div>
      </div>

      <div style="grid-column: span 12">
        <table class="modelsTable" :aria-label="t('sectionPerfiles')">
          <thead>
            <tr>
              <th>{{ t('thModelo') }}</th>
              <th>{{ t('thPotencia') }}</th>
              <th style="width: 220px">{{ t('thAcciones') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in state.models" :key="m.id">
              <td>
                {{ m.nombre }}
                <span v-if="m.builtin" class="tagDefault" style="margin-left: 8px">{{ t('tagDefault') }}</span>
              </td>
              <td>{{ Math.round(m.potenciaW) }}</td>
              <td>
                <button class="btn btnSmall" type="button" @click="store.startEditModel(m.id)">{{ t('btnEditar') }}</button>
                <button
                  v-if="!m.builtin"
                  class="btn btnSmall btnDanger"
                  type="button"
                  @click="store.deleteModelWithConfirm(m.id)"
                >
                  {{ t('btnBorrar') }}
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
import { useAppStore } from '../stores/useAppStore.js'
import { useLocaleStore } from '../stores/useLocaleStore.js'

const store = useAppStore()
const { state } = store
const { t } = useLocaleStore()
</script>
