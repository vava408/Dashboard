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
  min-height: clamp(90px, 100%, 118px);
  background: #0d1522;
  border: 1px solid #1c293b;
  border-radius: 8px;
  padding: clamp(12px, 3vw, 16px);
  box-shadow: 0 10px 25px rgba(2, 7, 17, 0.18);
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
}

h3 {
  margin: 0 0 8px;
  color: #7f8da5;
  font-size: clamp(0.55rem, 2vw, 0.65rem);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  min-height: 14px;
}

.value {
  margin: 0;
  color: #f0f4fb;
  font-size: clamp(1.1rem, 4vw, 1.55rem);
  font-weight: 700;
  line-height: 1.1;
}

canvas {
  display: block;
  width: 100%;
  height: 18px;
  margin-top: auto;
  margin-top: 8px;
}

.details {
  margin-top: 4px;
  color: #b8c2db;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
}

@media (max-width: 768px) {
  .cadre {
    min-height: 85px;
    padding: 12px;
  }

  h3 {
    font-size: 0.6rem;
    margin-bottom: 6px;
  }

  .value {
    font-size: 1.2rem;
  }

  canvas {
    height: 16px;
    margin-top: 6px;
  }
}

@media (max-width: 560px) {
  .cadre {
    min-height: 75px;
    padding: 10px;
  }

  h3 {
    font-size: 0.55rem;
    margin-bottom: 4px;
  }

  .value {
    font-size: 1rem;
  }

  canvas {
    height: 14px;
    margin-top: 4px;
  }
}
</style>
