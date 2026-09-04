<script setup>
import { onMounted, ref } from 'vue';
import Navbar from '../components/common/Navbar.vue'


const pm2 = ref([])
let interval = null


onMounted(async ( ) =>{
  await getPm2()
  if (interval) clearInterval(interval)
  interval = setInterval(async () => {
    await getPm2();
  }, 1000);
})

async function getPm2() {
  try {
    const response = await fetch("/api/bots/getBots")
    const data = await response.json()
    pm2.value =data.bots
  } catch (error) {
    console.log(error);
  }

}

async function restart(id) {
    try {
        const response = await fetch("/api/bots/restart?botId=" + id );

        if (response == false) {
            window.dispatchEvent(
  				new CustomEvent("notify", {
    				detail: {
      					type: "error",
      					message: "Erreur le bot ne redemarera pas..."
    				}
  				})
			);
            return;
        }

        window.dispatchEvent(
  				new CustomEvent("notify", {
    				detail: {
      					type: "success",
      					message: "Bot redémarré avec succès !"
    				}
  				})
			);
    } catch (error) {
        notify("error", "Impossible de contacter le serveur");
    }
}

async function supprimer(id) {
    try {
        const response = await fetch("/api/bots/restart?botId=" + id );

        if (response.success == false) {
            window.dispatchEvent(
  				new CustomEvent("notify", {
    				detail: {
      					type: "error",
      					message: "Erreur le bot ne redemarera pas..."
    				}
  				})
			);
            return;
        }

        window.dispatchEvent(
  				new CustomEvent("notify", {
    				detail: {
      					type: "success",
      					message: "Bot redémarré avec succès !"
    				}
  				})
			);
    } catch (error) {
        notify("error", "Impossible de contacter le serveur");
    }
}

async function stop(id) {
    try {
        const response = await fetch("/api/bots/stop?botId=" + id );

        if (response == false) {
            window.dispatchEvent(
  				new CustomEvent("notify", {
    				detail: {
      					type: "error",
      					message: "Erreur le bot ne s'arrete pas..."
    				}
  				})
			);
            return;
        }

        window.dispatchEvent(
  				new CustomEvent("notify", {
    				detail: {
      					type: "success",
      					message: "Bot arreter avec succès !"
    				}
  				})
			);
    } catch (error) {
        notify("error", "Impossible de contacter le serveur");
    }
}
</script>

<template>
  <div class="pm2-app-shell">
    <Navbar />

    <main class="pm2-content">
      <div class="pm2-table-wrap">
        <table class="pm2-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Status</th>
              <th>PID</th>
              <th>UPTIME</th>
              <th>RAM</th>
              <th>CPU</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="process in pm2">
              <td>{{ process.name }}</td>
              <td>
                <span :class="process.status"> ● {{ process.status }}</span>
              </td>

              <td>{{ process.pid }}</td>
              <td>{{ process.uptime }}</td>
              <td>{{ process }}</td>
              <td>2.1%</td>

              <td class="actions">
                <button @click="restart(process.id)" class="action-btn restart" title="Redémarrer">
                  ↻
                </button>

                <button @click="stop(process.id)" class="action-btn stop" title="Arrêter">
                  ■
                </button>

                <button @click="supprimer(process.id)" class="action-btn delete" title="Supprimer">
                  🗑
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<style scoped>
.pm2-app-shell {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #080d16;
  color: #e8edf8;
}

.pm2-content {
  flex: 1 1 auto;
  min-width: 0;
  padding: 24px;
}

.pm2-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.pm2-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  background: #0d141d;
  color: #e6eaf0;
  border: 1px solid #1d2835;
  border-radius: 8px;
  overflow: hidden;
}

/* Header */
.pm2-table thead {
  background: #101923;
}

.pm2-table th {
  height: 42px;
  padding: 0 14px;
  color: #8e99a8;
  font-size: 11px;
  font-weight: 500;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #202c3a;
}

/* Cellules */
.pm2-table td {
  height: 48px;
  padding: 0 14px;
  font-size: 13px;
  border-bottom: 1px solid #18232f;
  white-space: nowrap;
}

/* Dernière ligne */
.pm2-table tbody tr:last-child td {
  border-bottom: none;
}

/* Hover */
.pm2-table tbody tr {
  transition: background 0.15s ease;
}

.pm2-table tbody tr:hover {
  background: #121d29;
}

/* Nom du processus */
.pm2-table td:first-child {
  color: #f1f3f6;
  font-weight: 500;
}

/* Status */
.status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 500;
}

.online {
  color: #4ade80;
  background: rgba(34, 197, 94, 0.10);
}

.stopped {
  color: #ff482f;
  background: rgba(34, 197, 94, 0.10);
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Boutons */
.action-btn {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #273444;
  border-radius: 5px;

  background: #111b26;
  color: #8d99a8;

  font-size: 13px;
  cursor: pointer;

  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}

.action-btn:hover {
  background: #1b2836;
  color: #ffffff;
}

/* Restart */
.action-btn.restart:hover {
  color: #60a5fa;
  border-color: rgba(96, 165, 250, 0.4);
}

/* Stop */
.action-btn.stop:hover {
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.4);
}

/* Delete */
.action-btn.delete:hover {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.4);
}
</style>
