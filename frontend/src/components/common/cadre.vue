<script setup>
import { Chart } from 'chart.js';

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<template>
  <div class="cadre">
    <h3>{{ props.item.label || 'Statistique' }}</h3>
    <p class="value">{{ props.item.text || props.item.value || 'N/A' }}</p>
    <canvas :id="props.item.label || 'erreur'" ></canvas>
  </div>
</template>

<style scoped>
.cadre {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(8px);
  max-width: 180px;
  width: 100%;
  max-height: 180px;
  height: 100%;

}

h3 {
  margin: 0 0 4px;
  color: #f5f7fb;
  font-size: 0.9rem;
}

.value {
  margin: 0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
}

.details {
  margin-top: 4px;
  color: #b8c2db;
  font-size: 0.8rem;
}
</style>
