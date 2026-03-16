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
        Estima costo por <b>material</b> + <b>electricidad</b> (y un costo fijo opcional). Perfiles de impresora guardados
        en tu navegador.
      </p>
    </header>

    <main class="grid">
      <TabsPanel />
      <ResultsPanel />
    </main>

    <footer>Hecho para cotizar rápido: material + luz (Chile) · modelos guardados localmente</footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './stores/useAppStore.js'
import TabsPanel from './components/TabsPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'

const { init } = useAppStore()
onMounted(() => init())
</script>
