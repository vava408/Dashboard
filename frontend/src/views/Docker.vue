<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Navbar from '../components/common/Navbar.vue'

const containers = ref([])
const hasError = ref(false)
let refreshTimer

onMounted(() => {
  loadContainers()
  refreshTimer = setInterval(loadContainers, 2000)
})

onBeforeUnmount(() => clearInterval(refreshTimer))

async function loadContainers() {
  try {
    const response = await fetch('/api/docker/getDockerContainers')
    const data = await response.json()
    containers.value = data.docker || []
    hasError.value = !response.ok
  } catch {
    hasError.value = true
  }
}

function isRunning(container) {
  return container[4]?.startsWith('Up')
}
</script>

<template>
  <div class="docker-app-shell">
    <Navbar />
    <main class="docker-content">
      <div class="docker-heading">
        <div>
          <p class="eyebrow">Infrastructure</p>
          <h1>Docker</h1>
        </div>
        <span class="container-count">{{ containers.length }} conteneur<span v-if="containers.length !== 1">s</span></span>
      </div>

      <div v-if="hasError" class="docker-error">Docker est momentanément indisponible.</div>

      <div class="docker-table-wrap">
        <table class="docker-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>État</th>
              <th>Image</th>
              <th>Commande</th>
              <th>Créé</th>
              <th>Ports</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="container in containers" :key="container[0]">
              <td class="container-name">
                <span class="container-mark">◈</span>
                {{ container[6] }}
              </td>
              <td>
                <span class="status" :class="isRunning(container) ? 'running' : 'stopped'">
                  <span class="status-dot"></span>{{ isRunning(container) ? 'En ligne' : 'Arrêté' }}
                </span>
              </td>
              <td class="muted">{{ container[1] }}</td>
              <td class="command">{{ container[2] }}</td>
              <td class="muted">{{ container[3] }}</td>
              <td class="ports">{{ container[5] || '-' }}</td>
            </tr>
            <tr v-if="containers.length === 0">
              <td colspan="6" class="empty">Aucun conteneur Docker trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<style scoped>
.docker-app-shell { display: flex; width: 100%; min-height: 100vh; background: #080d16; color: #e8edf8; }
.docker-content { flex: 1 1 auto; min-width: 0; padding: 28px; }
.docker-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin: 2px 0 22px; }
.eyebrow { margin: 0 0 7px; color: #64748b; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; }
h1 { margin: 0; color: #f3f6fc; font-size: 24px; font-weight: 600; letter-spacing: .01em; }
.container-count { color: #8c9ab0; font-size: 11px; }
.docker-table-wrap { width: 100%; overflow-x: auto; }
.docker-table { width: 100%; min-width: 850px; border-collapse: collapse; background: #0d141d; border: 1px solid #1d2835; border-radius: 8px; overflow: hidden; }
.docker-table thead { background: #101923; }
.docker-table th { height: 42px; padding: 0 14px; color: #8e99a8; font-size: 11px; font-weight: 500; text-align: left; text-transform: uppercase; letter-spacing: .4px; border-bottom: 1px solid #202c3a; }
.docker-table td { height: 52px; padding: 0 14px; font-size: 12px; border-bottom: 1px solid #18232f; white-space: nowrap; }
.docker-table tbody tr:last-child td { border-bottom: 0; }
.docker-table tbody tr { transition: background .15s ease; }
.docker-table tbody tr:hover { background: #121d29; }
.container-name { color: #f1f3f6; font-weight: 500; }
.container-mark { display: inline-grid; place-items: center; width: 24px; height: 24px; margin-right: 8px; color: #74a7ff; background: #172b49; border-radius: 6px; font-size: 12px; }
.status { display: inline-flex; align-items: center; gap: 7px; padding: 5px 9px; border-radius: 5px; font-size: 10px; font-weight: 500; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.running { color: #4ade80; background: rgba(34, 197, 94, .1); }
.stopped { color: #ff806f; background: rgba(239, 68, 68, .1); }
.muted, .command { color: #9aa6b8; }
.command { max-width: 230px; overflow: hidden; text-overflow: ellipsis; }
.ports { color: #82b4ff; }
.empty { height: 100px !important; color: #8e99a8; text-align: center; }
.docker-error { margin-bottom: 14px; padding: 12px 14px; color: #ffaaa0; background: rgba(239, 68, 68, .1); border: 1px solid rgba(239, 68, 68, .3); border-radius: 6px; font-size: 12px; }
@media (max-width: 900px) { .docker-content { padding: 20px 14px; } .docker-heading { margin-bottom: 16px; } }
</style>
