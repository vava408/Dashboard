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
  min-width: 0;
  min-height: 118px;
  background: #0d1522;
  border: 1px solid #1c293b;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(2, 7, 17, 0.18);
  overflow: hidden;
  width: 100%;
}

h3 {
  margin: 0 0 8px;
  color: #7f8da5;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.value {
  margin: 0;
  color: #f0f4fb;
  font-size: 1.55rem;
  font-weight: 700;
}

canvas {
  display: block;
  width: 100%;
  height: 18px;
  margin-top: 8px;
}

.details {
  margin-top: 4px;
  color: #b8c2db;
  font-size: 0.8rem;
}
</style>
