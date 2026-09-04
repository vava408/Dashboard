<template>
  <Teleport to="body">
    <div class="notifications-container">

      <TransitionGroup name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="notification.type"
        >

          <!-- Icône -->
          <div class="notification-icon">
            <span v-if="notification.type === 'success'">✓</span>
            <span v-else-if="notification.type === 'error'">×</span>
            <span v-else-if="notification.type === 'warning'">!</span>
            <span v-else>i</span>
          </div>

          <!-- Texte -->
          <div class="notification-message">
            {{ notification.message }}
          </div>

          <!-- Bouton fermeture -->
          <button
            class="notification-close"
            @click="removeNotification(notification.id)"
          >
            ×
          </button>

        </div>
      </TransitionGroup>

    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const notifications = ref([]);

let notificationId = 0;

function showNotification(type, message, duration = 5000) {

  const id = ++notificationId;

  notifications.value.push({
    id,
    type,
    message
  });

  // Suppression automatique
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }
}

function removeNotification(id) {
  notifications.value = notifications.value.filter(
    notification => notification.id !== id
  );
}

/*
 * Permet d'appeler une notification
 * depuis n'importe quel fichier :
 *
 * window.notify("success", "Bot redémarré !");
 */
function handleNotify(event) {

  const {
    type = "info",
    message = "",
    duration = 5000
  } = event.detail || {};

  showNotification(type, message, duration);
}

onMounted(() => {
  window.addEventListener("notify", handleNotify);
});

onUnmounted(() => {
  window.removeEventListener("notify", handleNotify);
});
</script>

<style scoped>

.notifications-container {
  position: fixed;

  top: 10px;
  right: 10px;

  width: 350px;

  display: flex;
  flex-direction: column;

  gap: 15px;

  z-index: 99999;

  pointer-events: none;
}


/* =========================
   NOTIFICATION
========================= */

.notification {
  position: relative;

  width: 350px;
  min-height: 70px;

  box-sizing: border-box;

  display: flex;
  align-items: center;

  padding: 9px 35px 9px 9px;

  border-radius: 6px;

  color: white;

  font-size: 16px;
  font-weight: 700;

  box-shadow:
    0 3px 8px rgba(0, 0, 0, 0.25);

  pointer-events: auto;

  overflow: hidden;
}


/* =========================
   ICONE
========================= */

.notification-icon {
  flex-shrink: 0;

  width: 48px;
  height: 48px;

  margin-right: 13px;

  border-radius: 50%;

  border: 2px solid currentColor;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 31px;
  font-weight: 300;
}

.notification-icon span {
  line-height: 1;
}


/* =========================
   MESSAGE
========================= */

.notification-message {
  line-height: 1.25;

  word-break: break-word;

  text-shadow:
    1px 1px 1px rgba(0, 0, 0, 0.25);
}


/* =========================
   BOUTON FERMER
========================= */

.notification-close {
  position: absolute;

  top: 4px;
  right: 6px;

  width: 22px;
  height: 22px;

  padding: 0;

  border: none;

  background: transparent;

  color: rgba(255, 255, 255, 0.8);

  font-size: 20px;

  cursor: pointer;

  line-height: 20px;
}

.notification-close:hover {
  color: white;
}


/* =========================
   SUCCESS
========================= */

.notification.success {
  background: #00b969;

  border: 1px solid #008f51;
}

.notification.success .notification-icon {
  color: #007f49;
}


/* =========================
   ERROR
========================= */

.notification.error {
  background: #ff3b3b;

  border: 1px solid #d82b2b;
}

.notification.error .notification-icon {
  color: #c52b2b;
}


/* =========================
   WARNING
========================= */

.notification.warning {
  background: #f7bd18;

  border: 1px solid #d99d00;
}

.notification.warning .notification-icon {
  color: #d39900;
}


/* =========================
   INFO
========================= */

.notification.info {
  background: #08b5cc;

  border: 1px solid #008fa3;
}

.notification.info .notification-icon {
  color: #00899b;
}


/* =========================
   ANIMATION
========================= */

.notification-enter-active {
  animation: notification-in 0.35s ease-out;
}

.notification-leave-active {
  animation: notification-out 0.3s ease-in;
}

.notification-move {
  transition: transform 0.3s ease;
}


@keyframes notification-in {

  from {
    opacity: 0;
    transform: translateX(100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }

}


@keyframes notification-out {

  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(100%);
  }

}


/* =========================
   MOBILE
========================= */

@media (max-width: 500px) {

  .notifications-container {
    top: 10px;
    right: 10px;
    left: 10px;

    width: auto;
  }

  .notification {
    width: 100%;
  }

}

</style>