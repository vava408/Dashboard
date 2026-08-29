<script setup>
import { computed, onMounted, onUnmounted, ref, registerRuntimeCompiler } from 'vue'
import Cadre from '../components/common/cadre.vue'
import Navbar from '../components/common/Navbar.vue'
import { AgCharts, AllCommunityModule, ModuleRegistry } from 'ag-charts-community'

ModuleRegistry.registerModules([AllCommunityModule])

const info = ref([])
const filteredInfo = computed(() =>
  info.value.filter(item => String(item?.label ?? '').toUpperCase() !== 'UPTIME')
)

const uptime = ref([])
const bot = ref([])
const botOnline = ref([])
const API_IP = import.meta.env.VITE_API_IP
const API_PORT = import.meta.env.VITE_API_PORT || 5000
let interval = null
let chart = null
const infoGraphique = []
const ProcessNonBOTPM2 = import.meta.env.VITE_APP_NON_BOTS.split(',').map(bot => bot.trim());
const pm2 = ref([])

onMounted(async () => {
  chart = AgCharts.create({
    container: document.getElementById('grapheCPU'),
    title: { text: 'Température CPU', color: '#e2e8f0', fontSize: 16, fontWeight: 600 },
    background: { fill: 'rgba(12, 18, 29, 0.9)' },
    data: [],
    series: [
      {
        type: 'line',
        xKey: 'time',
        yKey: 'value',
        yName: 'CPU',
        stroke: '#6d5ce7',
        strokeWidth: 3,
        marker: { fill: '#a78bfa', stroke: '#0f172a', strokeWidth: 2, size: 4 },
      },
    ],
    axes: {
      x: {
        type: 'time',
        position: 'bottom',
        gridStyle: [{ stroke: 'rgba(148, 163, 184, 0.18)' }],
        label: { color: '#cbd5e1' },
      },
      y: {
        type: 'number',
        position: 'left',
        title: { text: 'Température (°C)', color: '#cbd5e1' },
        gridStyle: [{ stroke: 'rgba(148, 163, 184, 0.18)' }],
        label: { color: '#cbd5e1' },
      },
    },
    legend: { enabled: false },
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
  })

  await getStatServeur()
  await getPm2()
  interval = setInterval(getStatServeur, 5000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
  if (chart) chart.destroy()
})

async function getStatServeur() {
  try {
    const response = await fetch('/api/system/stats')
    if (!response.ok) {
      throw new Error('Impossible de charger les statistiques')
    }

    const data = await response.json()
    info.value = Object.values(data)
    setCpuTemp(data.cpu.value)
    uptime.value = info.value.filter(item => String(item?.label ?? '').toUpperCase() === 'UPTIME')
  } catch (error) {
    console.error(error)
    info.value = []
  }
}

async function getPm2() {
  try {
    const response = await fetch("/api/bots/getBots")
    const data = await response.json()
    pm2.value =     bot.value = data.bots
    bot.value = data.bots.filter(bot => !ProcessNonBOTPM2.includes(bot.name))
    botOnline.value = bot.value.filter(bot => bot.status === "online")
    console.log(botOnline.value)
    console.log(data)
  } catch (error) {
    console.log(error);
  }

}

function setCpuTemp(point) {
  infoGraphique.push({ time: new Date(), value: point })
  chart?.updateDelta({ data: [...infoGraphique] })
}
</script>

<template>
  <div class="app-shell">
    <Navbar />

    <main class="main-content">
      <header class="topbar">
        <div class="breadcrumbs"><span>Workspace</span><b>/</b><strong>Dashboard</strong></div>
        <div class="top-actions">
          <span class="updated">Actualisé à l'instant</span><button class="icon-button"
            title="Notifications">◌</button><button class="icon-button" title="Options">•••</button>
        </div>
      </header>
      <section class="dashboard">
        <div class="page-heading">
          <div>
            <p class="eyebrow">Vue d'ensemble</p>
            <h1>Dashboard</h1>
            <p>Surveillez votre serveur Raspberry Pi en temps réel.</p>
          </div>
        </div>
        <div v-if="filteredInfo.length" class="cards-grid">
          <Cadre v-for="(value, index) in filteredInfo" :key="`${value.label}-${index}`" :item="value" />
        </div>
        <div v-else class="empty-state">Connexion aux métriques en cours...</div>
        <div class="content-grid">
          <section id="monitoring" class="panel chart-panel">
            <div class="panel-heading">
              <div>
                <h2>Utilisation CPU</h2>
              </div>
              <button class="ghost-button">⋮</button>
            </div>
            <div id="grapheCPU" class="graph-cpu"></div>
          </section>
          <section class="panel services-panel">
            <div class="panel-heading">
              <div>
                <h2>État des services</h2>
                <span>Statut de vos services</span>
              </div>
              <span class="live-dot">● En ligne</span>
            </div>
            <ul class="service-list">
              <li v-for="service in pm2"><span>{{ service.name }}</span><strong :class="service.status">● {{ service.status }}</strong></li>
            </ul>
          </section>
        </div>
        <div class="quick-stats">
          <div><span>Bots en ligne</span><strong>{{ botOnline.length }}</strong><small>sur {{ bot.length }} bots</small>
          </div>
          <div>
            <span>Total serveurs Discord</span><strong></strong><small>sur tous vos bots</small>
          </div>
          <div><span>Utilisateurs</span><strong></strong><small>sur tous vos bots</small></div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  color: #e8edf8;
  background: #080d16;
}

.sidebar {
  width: 228px;
  flex: none;
  display: flex;
  flex-direction: column;
  padding: 24px 14px 18px;
  border-right: 1px solid #1b2637;
  background: #0b111c;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px 34px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  background: linear-gradient(135deg, #7056ef, #3b9cff);
  box-shadow: 0 6px 16px #4d4ad066;
}

.brand strong {
  display: block;
  font-size: 12px;
  letter-spacing: 0.02em;
}

.brand strong span {
  color: #a9b2ca;
}

.brand small,
.user-chip small {
  display: block;
  color: #68758d;
  font-size: 8px;
  letter-spacing: 0.09em;
}

.side-nav {
  display: grid;
  gap: 4px;
}

.nav-label {
  margin: 16px 10px 5px;
  color: #56647b;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.nav-label:first-child {
  margin-top: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 33px;
  padding: 0 10px;
  color: #7e8ca4;
  font-size: 11px;
  text-decoration: none;
  border-radius: 6px;
  transition: 0.2s;
}

.nav-item:hover,
.nav-item.active {
  color: #fff;
  background: #25205b;
}

.nav-item.active {
  box-shadow: inset 2px 0 #7c63ff;
}

.nav-icon {
  width: 15px;
  color: #8995ad;
  text-align: center;
  font-size: 13px;
}

.nav-count {
  margin-left: auto;
  color: #a8b6d1;
  font-size: 10px;
}

.sidebar-footer {
  margin-top: auto;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px 8px;
  border-top: 1px solid #1a2535;
  color: #eef3ff;
}

.user-chip strong {
  display: block;
  font-size: 10px;
}

.avatar {
  display: grid;
  place-items: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 700;
  background: #2b3d6c;
  color: #bcd6ff;
}

.more {
  margin-left: auto;
  color: #69758a;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
  min-height: 100vh;
  height: 100%;
}

.topbar {
  height: auto;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: clamp(8px, 2vw, 15px);
  padding: clamp(10px, 2vw, 15px) clamp(12px, 3vw, 38px);
  border-bottom: 1px solid #182334;
}

.breadcrumbs {
  display: flex;
  gap: clamp(6px, 2vw, 10px);
  align-items: center;
  color: #627089;
  font-size: clamp(0.75rem, 2vw, 0.85rem);
  flex-wrap: wrap;
  min-width: 0;
}

.breadcrumbs b {
  color: #344156;
}

.breadcrumbs strong {
  color: #d8dfed;
  font-weight: 600;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: clamp(8px, 2vw, 15px);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.updated {
  color: #68758b;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  white-space: nowrap;
}

.icon-button,
.ghost-button {
  border: 1px solid #253149;
  background: #101826;
  color: #9ba9c1;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-button {
  width: clamp(24px, 5vw, 27px);
  height: clamp(24px, 5vw, 27px);
  padding: 0;
}

.main-content>.dashboard {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;
  max-width: none;
  height: auto;
  min-height: calc(100vh - 65px);
  margin: 0;
  padding: clamp(16px, 3vw, 22px) clamp(16px, 4vw, 24px) clamp(24px, 5vw, 32px);
  gap: clamp(8px, 2vw, 12px);
}

.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(12px, 3vw, 20px);
  margin-bottom: clamp(12px, 2vw, 18px);
  flex-wrap: wrap;
  align-items: flex-start;
}

.eyebrow {
  margin: 0 0 4px;
  color: #68758d;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.page-heading h1 {
  margin: 0;
  color: #f2f5fb;
  font-size: clamp(1.5rem, 4vw, 25px);
  letter-spacing: -0.02em;
  font-weight: 700;
  word-break: break-word;
}

.page-heading p:last-child {
  margin: clamp(2px, 1vw, 5px) 0 0;
  color: #738198;
  font-size: clamp(0.75rem, 2vw, 0.8rem);
  width: 100%;
  max-width: 100%;
}

.primary-button {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 13px;
  color: #fff;
  border: 0;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 600;
  background: #6c54e8;
  box-shadow: 0 8px 18px #5c48df33;
  cursor: pointer;
}

.primary-button span {
  font-size: 16px;
  line-height: 10px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(8px, 2vw, 12px);
  margin-bottom: clamp(10px, 2vw, 14px);
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  gap: clamp(12px, 2vw, 16px);
  align-items: stretch;
}

@media (min-width: 1400px) {
  .main-content > .dashboard {
    padding-inline: clamp(28px, 4vw, 64px);
  }

  .cards-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .content-grid {
    grid-template-columns: minmax(0, 2.2fr) minmax(360px, 1fr);
  }
}

@media (min-width: 901px) {
  .main-content > .dashboard {
    min-height: calc(100vh - 60px);
  }

  .content-grid {
    flex: 1 1 auto;
    min-height: 420px;
  }

  .panel {
    display: flex;
    flex-direction: column;
  }

  .graph-cpu {
    flex: 1 1 auto;
    height: auto;
    min-height: 300px;
  }

  .services-panel .service-list {
    flex: 1 1 auto;
  }
}

.panel {
  min-width: 0;
  padding: clamp(14px, 3vw, 22px);
  border: 1px solid #1c293b;
  border-radius: clamp(6px, 2vw, 10px);
  background: #0d1522;
  box-shadow: 0 12px 28px #0207112e;
  overflow: hidden;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: clamp(10px, 2vw, 13px);
  flex-wrap: wrap;
}

.panel-heading h2 {
  margin: 0;
  color: #e6ebf5;
  font-size: clamp(1.1rem, 2.5vw, 14px);
  font-weight: 600;
  letter-spacing: 0.01em;
  word-break: break-word;
}

.panel-heading span {
  display: block;
  margin-top: 3px;
  color: #637189;
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
}

.graph-cpu {
  width: 100%;
  height: clamp(200px, 50vh, 360px);
  min-height: 200px;
  border-radius: 6px;
  overflow: hidden;
  background: #0a111c;
}

.ghost-button {
  width: clamp(20px, 4vw, 24px);
  height: clamp(20px, 4vw, 24px);
  font-size: clamp(0.9rem, 3vw, 1rem);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.live-dot {
  color: #57d991 !important;
  font-size: clamp(0.7rem, 2vw, 0.9rem) !important;
  white-space: nowrap;
}

.service-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.service-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(8px, 2vw, 12px);
  padding: clamp(12px, 2vw, 20px) 0;
  border-bottom: 1px solid #182536;
  color: #9ca9bd;
  font-size: clamp(0.8rem, 2vw, 0.95rem);
  flex-wrap: wrap;
}

.service-list li:last-child {
  border: 0;
}

.service-list strong.online {
  color: #53d18c;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  font-weight: 600;
  white-space: nowrap;
}

.service-list strong.stopped {
  color: #d16253;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  font-weight: 600;
  white-space: nowrap;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(10px, 2vw, 14px);
  margin-top: clamp(10px, 2vw, 14px);
}

.quick-stats>div {
  padding: clamp(12px, 2.5vw, 14px) clamp(12px, 3vw, 16px);
  border: 1px solid #1c293b;
  border-radius: clamp(6px, 2vw, 8px);
  background: #0d1522;
}

.quick-stats span,
.quick-stats small {
  display: block;
  color: #66748b;
  font-size: clamp(0.7rem, 1.8vw, 0.75rem);
}

.quick-stats strong {
  display: block;
  margin: clamp(3px, 1vw, 5px) 0 2px;
  color: #f0f4fb;
  font-size: clamp(1.1rem, 3vw, 17px);
  font-weight: 700;
}

.empty-state {
  padding: 25px;
  color: #76849b;
  font-size: 11px;
}

.app-shell {
  width: 100%;
  overflow-x: hidden;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }

  .page-heading h1 {
    font-size: clamp(1.3rem, 3.5vw, 1.8rem);
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .panel-heading h2 {
    font-size: clamp(1rem, 2.2vw, 1.2rem);
  }

  .graph-cpu {
    height: clamp(250px, 45vh, 320px);
  }
}

@media (max-width: 900px) {
  .app-shell {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .sidebar {
    width: 100%;
  }

  .main-content {
    width: 100%;
    height: auto;
  }

  .main-content>.dashboard {
    height: auto;
    min-height: auto;
    padding: clamp(12px, 2.5vw, 18px);
  }

  .content-grid {
    gap: clamp(10px, 2vw, 12px);
    grid-template-columns: 1fr;
  }

  .panel {
    padding: clamp(12px, 2.5vw, 16px);
  }

  .graph-cpu {
    height: clamp(220px, 40vh, 280px);
  }

  .service-list li {
    padding: clamp(10px, 2vw, 12px) 0;
    font-size: clamp(0.8rem, 2vw, 0.9rem);
  }

  .topbar {
    padding: clamp(10px, 2.5vw, 14px);
    gap: clamp(8px, 2vw, 12px);
  }

  .updated {
    display: none;
  }

  .cards-grid,
  .quick-stats {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: clamp(8px, 2vw, 10px);
  }

  .panel-heading {
    flex-direction: column;
  }

  .live-dot {
    align-self: flex-start;
    margin-top: 8px;
  }
}

@media (max-width: 768px) {
  .page-heading h1 {
    font-size: clamp(1.2rem, 3vw, 1.5rem);
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .quick-stats {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .graph-cpu {
    height: clamp(180px, 35vh, 240px);
  }

  .service-list li {
    padding: clamp(8px, 1.5vw, 10px) 0;
  }

  .breadcrumbs {
    font-size: clamp(0.65rem, 1.8vw, 0.75rem);
  }

  .icon-button,
  .ghost-button {
    width: clamp(20px, 4vw, 24px);
    height: clamp(20px, 4vw, 24px);
  }
}

@media (max-width: 640px) {
  .main-content>.dashboard {
    padding: clamp(10px, 2vw, 14px);
  }

  .topbar {
    padding: clamp(8px, 2vw, 12px);
    height: auto;
    min-height: 50px;
  }

  .breadcrumbs {
    order: 1;
    width: 100%;
    font-size: 0.65rem;
  }

  .top-actions {
    order: 2;
    width: 100%;
    justify-content: flex-end;
  }

  .page-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: clamp(8px, 2vw, 10px);
    margin-bottom: clamp(8px, 2vw, 12px);
  }

  .page-heading h1 {
    font-size: clamp(1.1rem, 2.8vw, 1.3rem);
  }

  .cards-grid,
  .quick-stats {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: clamp(6px, 1.5vw, 8px);
  }

  .panel {
    padding: clamp(10px, 2vw, 12px);
  }

  .panel-heading h2 {
    font-size: clamp(0.95rem, 2vw, 1.1rem);
  }

  .graph-cpu {
    height: clamp(160px, 30vh, 200px);
  }

  .service-list li {
    padding: clamp(6px, 1.5vw, 8px) 0;
    font-size: clamp(0.75rem, 1.8vw, 0.85rem);
  }

  .service-list li span {
    width: 100%;
    margin-bottom: 4px;
  }

  .service-list strong {
    width: 100%;
    text-align: left;
  }

  .quick-stats span,
  .quick-stats small {
    font-size: clamp(0.65rem, 1.5vw, 0.7rem);
  }

  .quick-stats strong {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  }
}

@media (max-width: 560px) {
  .main-content>.dashboard {
    padding: clamp(8px, 2vw, 12px);
  }

  .topbar {
    padding: clamp(6px, 1.5vw, 10px);
    min-height: 45px;
    flex-direction: column;
    align-items: flex-start;
  }

  .breadcrumbs {
    font-size: 0.6rem;
    width: 100%;
  }

  .breadcrumbs b {
    display: none;
  }

  .top-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .page-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: clamp(6px, 1.5vw, 8px);
    margin-bottom: clamp(6px, 1.5vw, 10px);
  }

  .page-heading h1 {
    font-size: clamp(1rem, 2.5vw, 1.2rem);
  }

  .eyebrow {
    font-size: 0.6rem;
  }

  .page-heading p:last-child {
    font-size: 0.65rem;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: clamp(4px, 1vw, 6px);
  }

  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(6px, 1.5vw, 8px);
  }

  .panel {
    padding: clamp(8px, 1.5vw, 10px);
  }

  .panel-heading {
    flex-direction: column;
  }

  .panel-heading h2 {
    font-size: clamp(0.9rem, 2vw, 1rem);
  }

  .panel-heading span {
    font-size: 0.6rem;
    margin-top: 2px;
  }

  .graph-cpu {
    height: clamp(140px, 25vh, 180px);
  }

  .service-list {
    overflow-y: auto;
    max-height: 300px;
  }

  .service-list li {
    padding: clamp(4px, 1vw, 6px) 0;
    font-size: clamp(0.7rem, 1.5vw, 0.8rem);
    flex-direction: column;
    align-items: flex-start;
  }

  .service-list li span {
    width: 100%;
    margin-bottom: 2px;
  }

  .service-list strong {
    width: 100%;
    text-align: left;
    font-size: clamp(0.65rem, 1.5vw, 0.75rem);
  }

  .quick-stats>div {
    padding: clamp(8px, 1.5vw, 10px) clamp(8px, 2vw, 10px);
  }

  .quick-stats span,
  .quick-stats small {
    font-size: clamp(0.6rem, 1.2vw, 0.65rem);
  }

  .quick-stats strong {
    font-size: clamp(0.85rem, 2.2vw, 1rem);
    margin: clamp(2px, 0.8vw, 3px) 0 1px;
  }

  .icon-button,
  .ghost-button {
    width: clamp(18px, 3vw, 20px);
    height: clamp(18px, 3vw, 20px);
  }

  .live-dot {
    font-size: clamp(0.65rem, 1.5vw, 0.75rem) !important;
  }
}

@media (max-width: 380px) {
  .app-shell {
    width: 100%;
  }

  .main-content>.dashboard {
    padding: clamp(6px, 1.5vw, 10px);
  }

  .topbar {
    padding: clamp(4px, 1vw, 8px);
    min-height: 40px;
  }

  .breadcrumbs {
    font-size: 0.55rem;
  }

  .breadcrumbs strong {
    display: none;
  }

  .page-heading h1 {
    font-size: clamp(0.95rem, 2.2vw, 1.1rem);
  }

  .eyebrow {
    font-size: 0.55rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: clamp(4px, 1vw, 6px);
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }

  .panel {
    padding: clamp(6px, 1.2vw, 8px);
  }

  .panel-heading h2 {
    font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  }

  .graph-cpu {
    height: clamp(120px, 20vh, 150px);
  }

  .service-list {
    max-height: 250px;
  }

  .service-list li {
    padding: clamp(3px, 0.8vw, 4px) 0;
    font-size: clamp(0.65rem, 1.2vw, 0.75rem);
  }

  .icon-button,
  .ghost-button {
    width: clamp(16px, 2.5vw, 18px);
    height: clamp(16px, 2.5vw, 18px);
  }
}


  .service-list strong.online,
  .service-list strong.stopped {
    font-size: 8px;
    white-space: nowrap;
  }

  .quick-stats > div {
    padding: 12px 12px;
  }

</style>
