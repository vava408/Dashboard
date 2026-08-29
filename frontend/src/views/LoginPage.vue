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
  padding: clamp(16px, 4vw, 24px);
  background: transparent;
  color: #f5f7fb;
}

.login-shell {
  position: relative;
  width: min(440px, 100%);
  padding: clamp(18px, 5vw, 28px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: clamp(18px, 6vw, 28px);
  background: rgba(8, 12, 24, 0.78);
  backdrop-filter: blur(22px);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.45);
}

.login-brand {
  display: flex;
  align-items: center;
  gap: clamp(10px, 3vw, 16px);
  margin-bottom: clamp(10px, 3vw, 14px);
}

.brand-mark {
  width: clamp(40px, 12vw, 54px);
  height: clamp(40px, 12vw, 54px);
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #fff;
  background: linear-gradient(135deg, #7c5cff 0%, #34d6ff 100%);
  box-shadow: 0 12px 30px rgba(92, 118, 255, 0.35);
  font-size: clamp(16px, 4vw, 24px);
}

.brand-kicker {
  margin: 0 0 2px;
  color: #9da8c7;
  font-size: clamp(0.65rem, 2vw, 0.78rem);
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

h1 {
  margin: 0;
  font-size: clamp(1.3rem, 4vw, 2rem);
  line-height: 1.1;
  word-break: break-word;
}

.subtitle {
  margin: 0 0 clamp(12px, 3vw, 22px);
  color: #b8c2db;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
}

.login-panel {
  padding: clamp(14px, 4vw, 22px);
  border-radius: clamp(16px, 5vw, 22px);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.login-form {
  display: grid;
  gap: clamp(12px, 3vw, 16px);
}

label {
  display: grid;
  gap: 8px;
  color: #d8def0;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
}

input[type='email'],
input[type='password'] {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(10px, 3vw, 14px);
  padding: clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 16px);
  background: rgba(7, 10, 18, 0.75);
  color: #f6f8ff;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
  font-size: clamp(0.85rem, 2vw, 1rem);
}

input::placeholder {
  color: #6f7894;
}

input:focus {
  border-color: rgba(124, 92, 255, 0.9);
  box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.18);
  transform: translateY(-1px);
}

.login-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: clamp(10px, 3vw, 16px);
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  flex-wrap: wrap;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox input {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
}

a {
  color: #8ad8ff;
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: #a8e6ff;
  text-decoration: underline;
}

.login-button,
.login-secondary {
  width: 100%;
  border: 0;
  border-radius: clamp(10px, 3vw, 14px);
  padding: clamp(10px, 2.5vw, 14px) clamp(14px, 3vw, 18px);
  font-weight: 700;
  cursor: pointer;
  font-size: clamp(0.85rem, 2vw, 1rem);
  transition: all 0.2s ease;
}

.login-button {
  color: #fff;
  background: linear-gradient(135deg, #7c5cff 0%, #4f8cff 100%);
  box-shadow: 0 16px 30px rgba(92, 118, 255, 0.28);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(92, 118, 255, 0.38);
}

.login-button:active {
  transform: translateY(0);
}

.login-secondary {
  margin-top: clamp(10px, 2vw, 14px);
  color: #ecf2ff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.login-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}

.login-separator {
  display: grid;
  place-items: center;
  margin: clamp(10px, 3vw, 16px) 0 clamp(10px, 3vw, 14px);
  color: #8992af;
  font-size: clamp(0.75rem, 2vw, 0.85rem);
  position: relative;
}

.login-separator::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.login-separator {
  background: rgba(8, 12, 24, 0.78);
}

.feature-list {
  display: grid;
  gap: clamp(8px, 2vw, 10px);
  margin: clamp(12px, 3vw, 18px) 0 0;
  padding: 0;
  list-style: none;
  color: #bac4dc;
  font-size: clamp(0.8rem, 2vw, 0.92rem);
}

.feature-list li {
  position: relative;
  padding-left: 18px;
  word-break: break-word;
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
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .login-page {
    padding: 16px;
  }

  .login-shell {
    padding: 20px;
  }

  .login-panel {
    padding: 16px;
  }

  .login-row {
    flex-direction: column;
    align-items: stretch;
  }

  a {
    width: 100%;
    text-align: center;
  }

  h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
  }

  input[type='email'],
  input[type='password'] {
    font-size: 16px;
  }
}

@media (max-width: 520px) {
  .login-page {
    padding: 12px;
  }

  .login-shell {
    padding: 16px;
    border-radius: 20px;
  }

  .login-panel {
    padding: 14px;
    border-radius: 16px;
  }

  .brand-mark {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  h1 {
    font-size: clamp(1.1rem, 4.5vw, 1.4rem);
  }

  .login-form {
    gap: 12px;
  }

  label span {
    font-size: 0.85rem;
  }

  input[type='email'],
  input[type='password'] {
    padding: 10px 12px;
    border-radius: 10px;
  }

  .login-button,
  .login-secondary {
    padding: 12px 14px;
    font-size: 0.9rem;
    border-radius: 10px;
  }

  .login-row {
    gap: 12px;
  }

  .checkbox {
    gap: 8px;
    font-size: 0.85rem;
  }

  .feature-list {
    gap: 8px;
    margin-top: 12px;
  }

  .feature-list li {
    font-size: 0.8rem;
  }
}

@media (max-width: 380px) {
  .login-shell {
    padding: 14px;
  }

  .login-panel {
    padding: 12px;
  }

  .brand-mark {
    width: 36px;
    height: 36px;
    font-size: 12px;
  }

  .brand-kicker {
    font-size: 0.65rem;
  }

  h1 {
    font-size: 1rem;
  }

  .login-form {
    gap: 10px;
  }

  .login-row {
    gap: 10px;
  }
}
</style>
