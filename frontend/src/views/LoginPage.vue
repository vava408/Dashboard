<script setup>
const features = ['Supervision temps réel', 'Accès sécurisé', 'Gestion des bots et serveurs']
</script>

<template>
  <main class="login-page">
    <section class="login-shell">
      <div class="login-brand">
        <div class="brand-mark">AP</div>
        <div>
          <p class="brand-kicker">AirPanel Pro</p>
          <h1>Connexion à votre tableau de bord</h1>
        </div>
      </div>

      <p class="subtitle">Accédez à votre espace de pilotage en quelques secondes.</p>

      <div class="login-panel">
        <form class="login-form">
          <label>
            <span>Adresse e-mail</span>
            <input type="email" name="email" placeholder="you@example.com" autocomplete="email" />
          </label>

          <label>
            <span>Mot de passe</span>
            <input type="password" name="password" placeholder="••••••••••" autocomplete="current-password" />
          </label>

          <div class="login-row">
            <label class="checkbox">
              <input type="checkbox" name="remember" />
              <span>Se souvenir de moi</span>
            </label>

            <a href="#">Mot de passe oublié ?</a>
          </div>

          <button type="submit" class="login-button">Se connecter</button>
        </form>

        <div class="login-separator">ou</div>

        <button type="button" class="login-secondary">Continuer avec Google</button>

        <ul class="feature-list">
          <li v-for="feature in features" :key="feature">{{ feature }}</li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: transparent;
  color: #f5f7fb;
}

.login-shell {
  position: relative;
  width: min(440px, 100%);
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background: rgba(8, 12, 24, 0.78);
  backdrop-filter: blur(22px);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.45);
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
}

.brand-mark {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #fff;
  background: linear-gradient(135deg, #7c5cff 0%, #34d6ff 100%);
  box-shadow: 0 12px 30px rgba(92, 118, 255, 0.35);
}

.brand-kicker {
  margin: 0 0 2px;
  color: #9da8c7;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

h1 {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.1;
}

.subtitle {
  margin: 0 0 22px;
  color: #b8c2db;
}

.login-panel {
  padding: 22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  color: #d8def0;
  font-size: 0.95rem;
}

input[type='email'],
input[type='password'] {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 14px 16px;
  background: rgba(7, 10, 18, 0.75);
  color: #f6f8ff;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

input::placeholder {
  color: #6f7894;
}

input:focus {
  border-color: rgba(124, 92, 255, 0.9);
  box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.18);
}

.login-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 0.9rem;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.checkbox input {
  width: 16px;
  height: 16px;
  margin: 0;
}

a {
  color: #8ad8ff;
  text-decoration: none;
}

.login-button,
.login-secondary {
  width: 100%;
  border: 0;
  border-radius: 14px;
  padding: 14px 18px;
  font-weight: 700;
  cursor: pointer;
}

.login-button {
  color: #fff;
  background: linear-gradient(135deg, #7c5cff 0%, #4f8cff 100%);
  box-shadow: 0 16px 30px rgba(92, 118, 255, 0.28);
}

.login-secondary {
  margin-top: 14px;
  color: #ecf2ff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.login-separator {
  display: grid;
  place-items: center;
  margin: 16px 0 14px;
  color: #8992af;
  font-size: 0.85rem;
}

.feature-list {
  display: grid;
  gap: 10px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  color: #bac4dc;
  font-size: 0.92rem;
}

.feature-list li {
  position: relative;
  padding-left: 18px;
}

.feature-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.66em;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #6be3ff;
}

@media (max-width: 520px) {
  .login-shell {
    padding: 18px;
    border-radius: 24px;
  }

  .login-panel {
    padding: 18px;
  }

  .login-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
