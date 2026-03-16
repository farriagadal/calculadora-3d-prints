<template>
  <div role="tabpanel">
    <div class="sectionTitle">
      <span>Perfiles de impresora</span>
      <small>localStorage</small>
    </div>

    <div class="formGrid">
      <div class="field" style="grid-column: span 8">
        <div class="labelRow">
          <label for="modeloNombre">Nombre del modelo</label>
          <span class="hint">Ej: Ender 3 V2</span>
        </div>
        <input id="modeloNombre" v-model="state.modeloNombre" type="text" placeholder="Nombre" />
        <div class="errorText">{{ state.errors.modeloNombre }}</div>
      </div>

      <div class="field" style="grid-column: span 4">
        <div class="labelRow">
          <label for="modeloPotenciaW">Potencia promedio (W)</label>
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
            {{ state.editingModelId ? 'Guardar cambios' : 'Guardar modelo' }}
          </button>
          <button
            v-if="state.editingModelId"
            class="btn btnSmall btnGhost"
            type="button"
            @click="store.setModelFormMode('create')"
          >
            Cancelar edición
          </button>
          <button class="btn btnSmall btnDanger" type="button" @click="store.restoreModelsWithConfirm()">
            Restaurar modelos
          </button>
        </div>
        <div class="note">
          Puedes agregar modelos y editarlos. El modelo <span class="tagDefault">por defecto</span> no se elimina, pero
          puedes duplicarlo creando uno nuevo.
        </div>
      </div>

      <div class="field" style="grid-column: span 12">
        <table class="modelsTable" aria-label="Modelos guardados">
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Potencia (W)</th>
              <th style="width: 220px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in state.models" :key="m.id">
              <td>
                {{ m.nombre }}
                <span v-if="m.builtin" class="tagDefault" style="margin-left: 8px">por defecto</span>
              </td>
              <td>{{ Math.round(m.potenciaW) }}</td>
              <td style="display: flex; gap: 8px; flex-wrap: wrap">
                <button class="btn btnSmall" type="button" @click="store.startEditModel(m.id)">Editar</button>
                <button
                  v-if="!m.builtin"
                  class="btn btnSmall btnDanger"
                  type="button"
                  @click="store.deleteModelWithConfirm(m.id)"
                >
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
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()
const { state } = store
</script>
