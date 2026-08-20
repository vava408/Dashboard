<script setup>
import { onMounted, ref } from 'vue'
import Cadre from '../components/common/cadre.vue'
import { ModuleRegistry ,AgCharts, AllCommunityModule, time } from 'ag-charts-community'

ModuleRegistry.registerModules([AllCommunityModule])

const info = ref([])
const INTERVALLE = 5000
const API_IP = import.meta.env.API_IP
const API_PORT = import.meta.env.API_PORT || 5000
let interval = null
let chart = null
let infoGraphique = []

onMounted(async () => {


    const container = document.getElementById('grapheCPU')

  chart = AgCharts.create({
    container,

    title: {
      text: 'Température CPU',
      color: '#e2e8f0',
      fontSize: 16,
      fontWeight: 600
    },

    background: {
      fill: 'rgba(12, 18, 29, 0.9)'
    },

    data: [],

    series: [
      {
        type: 'line',
        xKey: 'time',
        yKey: 'value',
        yName: 'CPU',
        stroke: '#8b5cf6',
        strokeWidth: 3,
        fill: 'rgba(139, 92, 246, 0.18)',
        marker: {
          fill: '#a78bfa',
          stroke: '#0f172a',
          strokeWidth: 2,
          size: 4
        }
      }
    ],

    axes: {
      x: {
        type: 'time',
        position: 'bottom',
        gridStyle: [{ stroke: 'rgba(148, 163, 184, 0.18)' }],
        line: { stroke: 'rgba(148, 163, 184, 0.38)' },
        label: { color: '#cbd5e1' }
      },
      y: {
        type: 'number',
        position: 'left',
        title: {
          text: 'Température (°C)',
          color: '#cbd5e1'
        },
        gridStyle: [{ stroke: 'rgba(148, 163, 184, 0.18)' }],
        line: { stroke: 'rgba(148, 163, 184, 0.38)' },
        label: { color: '#cbd5e1' }
      }
    },

    legend: {
      enabled: false
    },

    padding: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  })

    await getStatServeur()
  interval = setInterval(() => {
     getStatServeur()
  }, INTERVALLE)
})

async function getStatServeur() {
  try {
    const response = await fetch(`http://${API_IP}:${API_PORT}/api/system/stats`)
    if (!response.ok) {
      throw new Error('Impossible de charger les statistiques')
    }

    const data = await response.json()
    info.value = Object.values(data)
    setCpuTemp(data.cpu.value)
  } catch (error) {
    console.error(error)
    info.value = []
  }
}

function setCpuTemp(point)
{
    infoGraphique.push({
    time:new Date(),
    value:point
  })

  console.log('Données :', infoGraphique)
  console.log(infoGraphique[0].time instanceof Date)
chart.updateDelta({
    data: [...infoGraphique]
  })

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

   <div class="chart-panel">
    <div class="chart-header">
      <div class="chart-title-wrap">
        <span class="chart-dot"></span>
        <span class="chart-label">Monitoring</span>
      </div>
      <span class="chart-status">Live</span>
    </div>
    <div id="grapheCPU" class="graph-cpu"></div>
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

.chart-panel {
  width: min(100%, 920px);
  margin-top: 12px;
  padding: 14px 16px 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(11, 17, 31, 0.98), rgba(13, 19, 31, 0.9));
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 18px 32px rgba(2, 6, 23, 0.45);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 2px 4px;
}

.chart-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #4ade80);
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.9);
}

.chart-label {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #cbd5e1;
  font-weight: 600;
}

.chart-status {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ae6b4;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.graph-cpu {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.8));
  border: 1px solid rgba(139, 92, 246, 0.12);
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
