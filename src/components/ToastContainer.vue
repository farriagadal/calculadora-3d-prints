<template>
  <Teleport to="body">
    <div class="toastContainer" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast" tag="div" class="toastList">
        <div
          v-for="toast in state.toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.kind}`"
        >
          <span class="toastMsg">{{ toast.msg }}</span>
          <button class="toastDismiss" type="button" @click="store.dismissToast(toast.id)" aria-label="Cerrar">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()
const { state } = store
</script>
