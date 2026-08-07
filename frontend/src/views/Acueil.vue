<script setup>
import { onMounted, ref } from 'vue'
import Cadre from '../components/common/cadre.vue'

const info = ref([])
const INTERVALLE = 5000
let interval = null

onMounted(async () => {
  getStatServeur()

  interval = setInterval(() => {
    getStatServeur()
  }, INTERVALLE)
})

async function getStatServeur() {
  try {
    const response = await fetch('http://localhost:5000/api/system/stats')
    if (!response.ok) {
      throw new Error('Impossible de charger les statistiques')
    }

    const data = await response.json()
    info.value = Object.values(data)
  } catch (error) {
    console.error(error)
    info.value = []
  }
}
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Vue d'ensemble du serveur.</p>

    <div v-if="info.length" class="cards-grid">
      <Cadre v-for="(value, index) in info" :key="`${value.label}-${index}`" :item="value" />
    </div>

    <p v-else class="empty-state">Aucun élément disponible.</p>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 50px;
  margin-top: 8px;
  max-width: 760px;
}

h1 {
  margin: 0;
  color: #f5f7fb;
}

p {
  margin: 0;
  color: #b8c2db;
}

.empty-state {
  color: #b8c2db;
}
</style>
