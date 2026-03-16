<template>
  <div class="container">
    <header>
      <div class="titleRow">
        <h1>Calculadora de costo de impresión 3D</h1>
        <div class="pill" title="Chile: la electricidad normalmente se cobra en CLP por kWh">
          Unidad luz: <code>CLP/kWh</code> · Tiempo: <code>hh:mm</code>
        </div>
      </div>
      <p class="subtitle">
        Estima costo por <b>material</b> + <b>electricidad</b> (y un costo fijo opcional). Se calcula automáticamente al escribir. Perfiles guardados en tu navegador.
      </p>
    </header>

    <main class="grid">
      <TabsPanel />
      <ResultsPanel />
    </main>

    <footer>Hecho para cotizar rápido: material + luz (Chile) · modelos guardados localmente</footer>
  </div>

  <ToastContainer />

  <button
    v-if="fabVisible"
    class="fab"
    type="button"
    @click="scrollToResults"
  >
    Ver resultados ↓
  </button>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref, computed } from 'vue'
import { useAppStore } from './stores/useAppStore.js'
import TabsPanel from './components/TabsPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'
import ToastContainer from './components/ToastContainer.vue'

const store = useAppStore()
const { state, init, recalcAuto } = store

const resultsVisible = ref(false)
const fabVisible = computed(() => !!state.lastCalc && !resultsVisible.value)

let observer = null

function scrollToResults() {
  document.getElementById('resultsPanel')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  init()

  // IntersectionObserver para el FAB móvil
  setTimeout(() => {
    const el = document.getElementById('resultsPanel')
    if (el) {
      observer = new IntersectionObserver(
        ([entry]) => { resultsVisible.value = entry.isIntersecting },
        { threshold: 0.3 }
      )
      observer.observe(el)
    }
  }, 100)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

let debounceTimer = null
watch(
  () => [
    state.precioMaterial, state.materialGramos, state.mermaPct, state.costoFijo,
    state.precioLuz, state.tiempoHoras, state.tiempoMinutos, state.impresoraId,
    state.potenciaW, state.consumoExtraW, state.decimales,
  ],
  () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => recalcAuto(), 500)
  }
)
</script>
