<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Cadre from '../components/common/cadre.vue'
import Navbar from '../components/common/Navbar.vue'
import { AgCharts, AllCommunityModule, ModuleRegistry } from 'ag-charts-community'

ModuleRegistry.registerModules([AllCommunityModule])

const info = ref([])
const API_IP = import.meta.env.VITE_API_IP
const API_PORT = import.meta.env.VITE_API_PORT || 5000
let interval = null
let chart = null
const infoGraphique = []

onMounted(async () => {
  chart = AgCharts.create({
    container: document.getElementById('grapheCPU'),
    title: { text: 'Température CPU', color: '#e2e8f0', fontSize: 16, fontWeight: 600 },
    background: { fill: 'rgba(12, 18, 29, 0.9)' },
    data: [],
    series: [{
      type: 'line', xKey: 'time', yKey: 'value', yName: 'CPU', stroke: '#6d5ce7', strokeWidth: 3,
      marker: { fill: '#a78bfa', stroke: '#0f172a', strokeWidth: 2, size: 4 }
    }],
    axes: {
      x: { type: 'time', position: 'bottom', gridStyle: [{ stroke: 'rgba(148, 163, 184, 0.18)' }], label: { color: '#cbd5e1' } },
      y: { type: 'number', position: 'left', title: { text: 'Température (°C)', color: '#cbd5e1' }, gridStyle: [{ stroke: 'rgba(148, 163, 184, 0.18)' }], label: { color: '#cbd5e1' } }
    },
    legend: { enabled: false },
    padding: { top: 20, right: 20, bottom: 20, left: 20 }
  })

  await getStatServeur()
  interval = setInterval(getStatServeur, 5000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
  if (chart) chart.destroy()
})

async function getStatServeur() {
  try {
    const response = await fetch(`http://${API_IP}:${API_PORT}/api/system/stats`)
    if (!response.ok) throw new Error('Impossible de charger les statistiques')
    const data = await response.json()
    info.value = Object.values(data)
    setCpuTemp(data.cpu.value)
  } catch (error) {
    console.error(error)
    info.value = []
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
      <header class="topbar"><div class="breadcrumbs"><span>Workspace</span><b>/</b><strong>Dashboard</strong></div><div class="top-actions"><span class="updated">Actualisé à l'instant</span><button class="icon-button" title="Notifications">◌</button><button class="icon-button" title="Options">•••</button></div></header>
      <section class="dashboard">
        <div class="page-heading"><div><p class="eyebrow">Vue d'ensemble</p><h1>Dashboard</h1><p>Surveillez votre serveur Raspberry Pi en temps réel.</p></div></div>
        <div v-if="info.length" class="cards-grid"><Cadre v-for="(value, index) in info" :key="`${value.label}-${index}`" :item="value" /></div>
        <div v-else class="empty-state">Connexion aux métriques en cours...</div>
        <div class="content-grid">
          <section id="monitoring" class="panel chart-panel"><div class="panel-heading"><div><h2>Utilisation CPU</h2></div><button class="ghost-button">⋮</button></div><div id="grapheCPU" class="graph-cpu"></div></section>
          <section class="panel services-panel"><div class="panel-heading"><div><h2>État des services</h2><span>Statut de vos services</span></div><span class="live-dot">● En ligne</span></div><ul class="service-list"><li><span>PM2 Daemon</span><strong>● En ligne</strong></li><li><span>Docker</span><strong>● En ligne</strong></li><li><span>NGINX</span><strong>● En ligne</strong></li><li><span>PostgreSQL</span><strong>● En ligne</strong></li><li><span>Redis</span><strong>● En ligne</strong></li></ul></section>
        </div>
        <div class="quick-stats"><div><span>Bots en ligne</span><strong>3</strong><small>sur 4 bots</small></div><div><span>Total serveurs Discord</span><strong>27</strong><small>sur tous vos bots</small></div><div><span>Utilisateurs</span><strong>5,842</strong><small>sur tous vos bots</small></div><div><span>Uptime</span><strong>4j 12h 37m</strong><small>Durée de fonctionnement</small></div></div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-shell{min-height:100vh;display:flex;color:#e8edf8;background:#080d16}.sidebar{width:228px;flex:none;display:flex;flex-direction:column;padding:24px 14px 18px;border-right:1px solid #1b2637;background:#0b111c}.brand{display:flex;align-items:center;gap:10px;padding:0 10px 34px}.brand-mark{display:grid;place-items:center;width:30px;height:30px;border-radius:9px;color:#fff;font-size:10px;font-weight:800;background:linear-gradient(135deg,#7056ef,#3b9cff);box-shadow:0 6px 16px #4d4ad066}.brand strong{display:block;font-size:12px;letter-spacing:.02em}.brand strong span{color:#a9b2ca}.brand small,.user-chip small{display:block;color:#68758d;font-size:8px;letter-spacing:.09em}.side-nav{display:grid;gap:4px}.nav-label{margin:16px 10px 5px;color:#56647b;font-size:9px;text-transform:uppercase;letter-spacing:.14em}.nav-label:first-child{margin-top:0}.nav-item{display:flex;align-items:center;gap:10px;min-height:33px;padding:0 10px;color:#7e8ca4;font-size:11px;text-decoration:none;border-radius:6px;transition:.2s}.nav-item:hover,.nav-item.active{color:#fff;background:#25205b}.nav-item.active{box-shadow:inset 2px 0 #7c63ff}.nav-icon{width:15px;color:#8995ad;text-align:center;font-size:13px}.nav-count{margin-left:auto;color:#a8b6d1;font-size:10px}.sidebar-footer{margin-top:auto}.user-chip{display:flex;align-items:center;gap:8px;margin-top:20px;padding:12px 8px;border-top:1px solid #1a2535;color:#eef3ff}.user-chip strong{display:block;font-size:10px}.avatar{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;font-size:9px;font-weight:700;background:#2b3d6c;color:#bcd6ff}.more{margin-left:auto;color:#69758a}.main-content{width:calc(100% - 228px);min-width:0}.topbar{height:65px;display:flex;align-items:center;justify-content:space-between;padding:0 38px;border-bottom:1px solid #182334}.breadcrumbs{display:flex;gap:10px;align-items:center;color:#627089;font-size:11px}.breadcrumbs b{color:#344156}.breadcrumbs strong{color:#d8dfed;font-weight:600}.top-actions{display:flex;align-items:center;gap:15px}.updated{color:#68758b;font-size:10px}.icon-button,.ghost-button{border:1px solid #253149;background:#101826;color:#9ba9c1;border-radius:5px;cursor:pointer}.icon-button{width:27px;height:27px}.main-content>.dashboard{max-width:1420px;margin:0 auto;padding:35px 38px 50px}.page-heading{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px}.eyebrow{margin:0 0 4px;color:#68758d;font-size:10px;text-transform:uppercase;letter-spacing:.12em}.page-heading h1{margin:0;color:#f2f5fb;font-size:25px;letter-spacing:-.02em;font-weight:700}.page-heading p:last-child{margin:5px 0 0;color:#738198;font-size:11px}.primary-button{display:flex;align-items:center;gap:7px;padding:9px 13px;color:#fff;border:0;border-radius:5px;font-size:10px;font-weight:600;background:#6c54e8;box-shadow:0 8px 18px #5c48df33;cursor:pointer}.primary-button span{font-size:16px;line-height:10px}.cards-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:18px}.content-grid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(280px,1fr);gap:14px}.panel{min-width:0;padding:17px 18px;border:1px solid #1c293b;border-radius:8px;background:#0d1522;box-shadow:0 10px 25px #0207112e}.panel-heading{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:13px}.panel-heading h2{margin:0;color:#e6ebf5;font-size:12px;font-weight:600}.panel-heading span{display:block;margin-top:3px;color:#637189;font-size:9px}.graph-cpu{width:100%;height:245px;border-radius:5px;overflow:hidden;background:#0a111c}.ghost-button{width:24px;height:24px;font-size:16px}.live-dot{color:#57d991!important;font-size:9px!important}.service-list{display:grid;gap:0;margin:0;padding:0;list-style:none}.service-list li{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #182536;color:#9ca9bd;font-size:10px}.service-list li:last-child{border:0}.service-list strong{color:#53d18c;font-size:9px;font-weight:600}.quick-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:14px}.quick-stats>div{padding:14px 16px;border:1px solid #1c293b;border-radius:8px;background:#0d1522}.quick-stats span,.quick-stats small{display:block;color:#66748b;font-size:9px}.quick-stats strong{display:block;margin:5px 0 2px;color:#f0f4fb;font-size:17px;font-weight:700}.empty-state{padding:25px;color:#76849b;font-size:11px}@media (max-width:900px){.sidebar{width:64px;padding-inline:8px}.brand{padding-inline:10px}.brand>div:last-child,.nav-item:not(.active) .nav-count,.nav-item{font-size:0}.nav-item{justify-content:center;padding:0}.nav-icon{font-size:14px}.user-chip{justify-content:center}.user-chip>span:not(.avatar){display:none}.main-content{width:calc(100% - 64px)}.main-content>.dashboard{padding:28px 22px}.topbar{padding:0 22px}.updated{display:none}.content-grid{grid-template-columns:1fr}.cards-grid,.quick-stats{grid-template-columns:repeat(2,1fr)}}@media (max-width:560px){.page-heading{align-items:flex-start;gap:16px;flex-direction:column}.cards-grid,.quick-stats{grid-template-columns:1fr}.main-content>.dashboard{padding:24px 14px}.topbar{padding:0 14px}.breadcrumbs{font-size:10px}}
</style>
