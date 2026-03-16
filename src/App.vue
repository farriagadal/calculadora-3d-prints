<template>
  <div class="container">
    <header>
      <div class="titleRow">
        <h1 style="font-weight: 900;
    transform: scaleY(1.06);
    letter-spacing: -6%;
    font-size: 27px;
    margin-bottom: 22px;text-shadow: 3px 3px #000000;">{{ t('appTitle') }}</h1>
        <div class="headerControls">
          <div class="localeSwitcher">
            <button class="tabBtn" :aria-selected="String(localeState.lang === 'es')" @click="setLang('es')">ES</button>
            <button class="tabBtn" :aria-selected="String(localeState.lang === 'en')" @click="setLang('en')">EN</button>
          </div>
          <div class="localeSwitcher">
            <button class="tabBtn" :aria-selected="String(localeState.currency === 'CLP')" @click="setCurrency('CLP')">CLP</button>
            <button class="tabBtn" :aria-selected="String(localeState.currency === 'USD')" @click="setCurrency('USD')">USD</button>
          </div>
        </div>
      </div>
      <p class="subtitle" v-html="t('appSubtitle')"></p>
    </header>

    <main class="grid">
      <TabsPanel />
      <ResultsPanel />
    </main>

    <footer>{{ t('appFooter') }}</footer>
  </div>

  <ToastContainer />

  <button
    v-if="fabVisible"
    class="fab"
    type="button"
    @click="scrollToResults"
  >
    {{ t('fabLabel') }}
  </button>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref, computed } from 'vue'
import { useAppStore } from './stores/useAppStore.js'
import { useLocaleStore } from './stores/useLocaleStore.js'
import TabsPanel from './components/TabsPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'
import ToastContainer from './components/ToastContainer.vue'

const store = useAppStore()
const { state, init, recalcAuto } = store

const { localeState, t, setLang, setCurrency } = useLocaleStore()

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

<style scoped>
.headerControls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.localeSwitcher {
  display: flex;
  align-items: center;
}
</style>
