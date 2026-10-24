<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Navbar from '../components/common/Navbar.vue'

const stats = ref(null)
const network = ref(null)
const disks = ref([])
const metrics = ref([])
const formattedNetwork = ref({
  upload: '--',
  download: '--',
})
const hasError = ref(false)
const isLoading = ref(true)
const formattedUpdatedAt = ref('Jamais')
let refreshTimer

onMounted(() => {
  getSystem()
  refreshTimer = setInterval(getSystem, 5000)
})

onBeforeUnmount(() => {
  clearInterval(refreshTimer)
})

async function getSystem() {
  const results = await Promise.all([getStats(), getNetwork(), getDisk()])
  hasError.value = results.includes(false)
  formattedUpdatedAt.value = new Date().toLocaleTimeString('fr-FR')
  isLoading.value = false
}

async function getStats() {
  try {
    const response = await fetch('/api/system/stats')

    if (!response.ok) {
      throw new Error('Impossible de récupérer les statistiques système')
    }

    const data = await response.json()
    stats.value = {
      cpu: {
        value: data.cpu?.value ?? 0,
        text: data.cpu?.text ?? '--',
      },
      ram: {
        value: data.ram?.value ?? 0,
        text: data.ram?.text ?? '--',
      },
      temperature: {
        value: data.temperature?.value ?? 0,
        text: data.temperature?.text ?? '--',
      },
      storage: {
        value: data.storage?.value ?? 0,
        text: data.storage?.text ?? '--',
      },
      uptime: {
        text: data.uptime?.text ?? '--',
      },
    }
    metrics.value = [
      {
        key: 'cpu',
        label: 'CPU',
        value: stats.value.cpu.value,
        text: stats.value.cpu.text,
        color: 'blue',
      },
      {
        key: 'ram',
        label: 'RAM',
        value: stats.value.ram.value,
        text: stats.value.ram.text,
        color: 'purple',
      },
      {
        key: 'temperature',
        label: 'Température',
        value: stats.value.temperature.value,
        text: stats.value.temperature.text,
        color: 'orange',
      },
      {
        key: 'storage',
        label: 'Stockage',
        value: stats.value.storage.value,
        text: stats.value.storage.text,
        color: 'green',
      },
    ]
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

async function getNetwork() {
  try {
    const response = await fetch('/api/system/reseau')

    if (!response.ok) {
      throw new Error('Impossible de récupérer les statistiques réseau')
    }

    const data = await response.json()
    network.value = {
      upload: formatBytes(data.Up),
      download: formatBytes(data.Down),
    }
    formattedNetwork.value = {
      upload: network.value.upload,
      download: network.value.download,
    }
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

async function getDisk() {
  try {
    const response = await fetch('/api/system/disk')

    if (!response.ok) {
      throw new Error('Impossible de récupérer les statistiques disque')
    }

    const data = await response.json()
    disks.value = (data.disks || []).map((disk) => ({
      filesystem: disk.filesystem,
      mount: disk.mount,
      use: Number(disk.use || 0),
      used: formatBytes(disk.used),
      total: formatBytes(disk.total),
      available: formatBytes(disk.available),
    }))
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

function formatBytes(bytes) {
  if (!Number.isFinite(Number(bytes))) {
    return '--'
  }

  const value = Number(bytes)

  if (value < 1024) {
    return `${value.toFixed(0)} B`
  }

  const units = ['KB', 'MB', 'GB', 'TB']
  let converted = value
  let unit = -1

  do {
    converted /= 1024
    unit += 1
  } while (converted >= 1024 && unit < units.length - 1)

  return `${converted.toFixed(converted >= 100 ? 0 : 1)} ${units[unit]}`
}
</script>

<template>
  <div class="system-app-shell">
    <Navbar />

    <main class="system-content">
      <header class="system-heading">
        <div>
          <p class="eyebrow">Monitoring</p>
          <h1>Système</h1>
          <p class="subtitle">Surveillance en temps réel de votre serveur.</p>
        </div>
        <div class="refresh-info">
          <span class="live-indicator"></span>
          <span>Actualisé à {{ formattedUpdatedAt }}</span>
        </div>
      </header>

      <div v-if="hasError" class="system-error">
        Impossible de récupérer toutes les métriques système. Nouvelle tentative automatique en
        cours.
      </div>

      <div v-if="isLoading && !stats" class="empty-state">Connexion aux métriques en cours...</div>

      <template v-else>
        <section class="metrics-grid" aria-label="Ressources système">
          <article v-for="metric in metrics" :key="metric.key" class="metric-card">
            <div class="metric-header">
              <span>{{ metric.label }}</span>
              <strong :class="`metric-value ${metric.color}`">{{ metric.text }}</strong>
            </div>
            <div class="progress-track">
              <span
                :class="`progress-value ${metric.color}`"
                :style="{ width: `${Math.min(metric.value, 100)}%` }"
              ></span>
            </div>
            <small>{{
              metric.key === 'temperature' ? 'Température actuelle' : 'Utilisation des ressources'
            }}</small>
          </article>
        </section>

        <section class="details-grid">
          <article class="panel network-panel">
            <div class="panel-heading">
              <div>
                <h2>Réseau</h2>
                <span>Trafic depuis le démarrage du service</span>
              </div>
              <span class="panel-icon">⌁</span>
            </div>
            <div class="network-values">
              <div class="network-value">
                <span class="network-arrow download">↓</span>
                <div>
                  <small>Reçu</small><strong>{{ formattedNetwork.download }}</strong>
                </div>
              </div>
              <div class="network-value">
                <span class="network-arrow upload">↑</span>
                <div>
                  <small>Envoyé</small><strong>{{ formattedNetwork.upload }}</strong>
                </div>
              </div>
            </div>
          </article>

          <article class="panel uptime-panel">
            <div class="panel-heading">
              <div>
                <h2>Disponibilité</h2>
                <span>Temps de fonctionnement</span>
              </div>
              <span class="status-badge">● En ligne</span>
            </div>
            <strong class="uptime-value">{{ stats?.uptime?.text || '--' }}</strong>
            <div class="uptime-line"><span></span></div>
            <small>Dernière actualisation : {{ formattedUpdatedAt }}</small>
          </article>
        </section>

        <section class="panel disk-panel">
          <div class="panel-heading">
            <div>
              <h2>Volumes de stockage</h2>
              <span
                >{{ disks.length }} volume<span v-if="disks.length !== 1">s</span> détecté<span
                  v-if="disks.length !== 1"
                  >s</span
                ></span
              >
            </div>
          </div>
          <div class="disk-table-wrap">
            <table class="disk-table">
              <thead>
                <tr>
                  <th>Système de fichiers</th>
                  <th>Point de montage</th>
                  <th>Utilisation</th>
                  <th>Utilisé</th>
                  <th>Disponible</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="disk in disks" :key="`${disk.filesystem}-${disk.mount}`">
                  <td class="disk-name">{{ disk.filesystem }}</td>
                  <td class="muted">{{ disk.mount }}</td>
                  <td>
                    <span class="disk-use">{{ Number(disk.use || 0).toFixed(1) }}%</span>
                  </td>
                  <td class="muted">{{ disk.used }} / {{ disk.total }}</td>
                  <td class="muted">{{ disk.available }}</td>
                </tr>
                <tr v-if="disks.length === 0">
                  <td colspan="5" class="empty-row">Aucun volume trouvé.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.system-app-shell {
  display: flex;
  width: 100%;
  min-height: 100vh;
  color: #e8edf8;
  background: #080d16;
}
.system-content {
  flex: 1 1 auto;
  min-width: 0;
  padding: 28px;
}
.system-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin: 2px 0 24px;
}
.eyebrow {
  margin: 0 0 7px;
  color: #64748b;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
h1 {
  margin: 0;
  color: #f3f6fc;
  font-size: 24px;
  font-weight: 600;
}
.subtitle {
  margin-top: 5px;
  color: #7f8da4;
  font-size: 12px;
}
.refresh-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8390a6;
  font-size: 11px;
}
.live-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #42d987;
  box-shadow: 0 0 10px #42d987;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}
.metric-card,
.panel {
  background: #0d141d;
  border: 1px solid #1d2835;
  border-radius: 8px;
}
.metric-card {
  padding: 16px;
}
.metric-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 15px;
  color: #a2aec1;
  font-size: 11px;
}
.metric-value {
  font-size: 19px;
  font-weight: 600;
}
.blue {
  color: #61a8ff;
}
.purple {
  color: #a78bfa;
}
.orange {
  color: #f6a63b;
}
.green {
  color: #4ade80;
}
.progress-track {
  height: 5px;
  overflow: hidden;
  background: #1c2938;
  border-radius: 99px;
}
.progress-value {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: currentColor;
}
.metric-card small,
.uptime-panel small {
  display: block;
  margin-top: 11px;
  color: #66758d;
  font-size: 10px;
}
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 14px;
}
.panel {
  padding: 18px;
}
.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 20px;
}
.panel-heading h2 {
  color: #eef3fb;
  font-size: 14px;
  font-weight: 600;
}
.panel-heading span {
  display: block;
  margin-top: 4px;
  color: #69788f;
  font-size: 10px;
}
.panel-icon {
  color: #73aaff !important;
  font-size: 24px !important;
}
.network-values {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.network-value {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #101923;
  border: 1px solid #1c2938;
  border-radius: 6px;
}
.network-arrow {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  font-size: 16px;
}
.download {
  color: #55d997;
  background: #12382d;
}
.upload {
  color: #6faeff;
  background: #172d4c;
}
.network-value small {
  display: block;
  color: #738199;
  font-size: 10px;
}
.network-value strong {
  display: block;
  margin-top: 2px;
  color: #eef3fb;
  font-size: 14px;
  font-weight: 600;
}
.status-badge {
  padding: 5px 8px;
  color: #4ade80 !important;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 5px;
  font-size: 10px !important;
}
.uptime-value {
  display: block;
  color: #f3f6fc;
  font-size: 27px;
  font-weight: 600;
}
.uptime-line {
  height: 4px;
  margin-top: 14px;
  overflow: hidden;
  background: #172332;
  border-radius: 99px;
}
.uptime-line span {
  display: block;
  width: 82%;
  height: 100%;
  background: #6d5ce7;
  border-radius: inherit;
}
.disk-panel {
  margin-top: 14px;
}
.disk-table-wrap {
  overflow-x: auto;
}
.disk-table {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
}
.disk-table th {
  padding: 0 12px 12px;
  color: #7e8ca2;
  font-size: 10px;
  font-weight: 500;
  text-align: left;
  text-transform: uppercase;
  border-bottom: 1px solid #202c3a;
}
.disk-table td {
  height: 48px;
  padding: 0 12px;
  color: #e7edf7;
  font-size: 11px;
  border-bottom: 1px solid #18232f;
}
.disk-table tbody tr:last-child td {
  border-bottom: 0;
}
.disk-name {
  font-weight: 500;
}
.muted {
  color: #9aa6b8 !important;
}
.disk-use {
  color: #63a8ff;
}
.empty-row {
  height: 80px !important;
  color: #7f8da4 !important;
  text-align: center;
}
.system-error {
  margin-bottom: 14px;
  padding: 12px 14px;
  color: #ffaaa0;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  font-size: 12px;
}
.empty-state {
  padding: 70px 20px;
  color: #8e99a8;
  text-align: center;
  background: #0d141d;
  border: 1px solid #1d2835;
  border-radius: 8px;
}
@media (max-width: 900px) {
  .system-content {
    padding: 20px 14px;
  }
  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 560px) {
  .system-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .details-grid {
    grid-template-columns: 1fr;
  }
  .metrics-grid {
    gap: 9px;
  }
  .metric-card {
    padding: 13px;
  }
  .refresh-info {
    align-self: flex-end;
  }
}
</style>
