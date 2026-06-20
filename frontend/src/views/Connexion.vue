<script setup>
import { ref } from 'vue';

const showPassword = ref(false)
</script>

<template>
  <main class="login-page">
    <h1 class="page-title">Panel Serveur</h1>

    <section class="login-card">
      <h1>Connexion</h1>
      <p class="subtitle">Accédez à votre espace de contrôle.</p>

      <form class="login-form">
        <label class="field">
          <span>Email</span>
          <input type="email" name="email" id="email" placeholder="vous@exemple.com" required>
        </label>

        <label class="field">
          <span>Mot de passe</span>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mot de passe"
              required
            />

            <button
              type="button"
              class="eye"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
            >
              {{ showPassword ? 'cacher' : 'voir' }}
            </button>
          </div>
        </label>

        <button type="submit" class="submit-button">Se connecter</button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 104px 24px 24px;
  background:
    radial-gradient(circle at top, rgba(92, 109, 255, 0.14), transparent 28%),
    linear-gradient(180deg, #f6f8fc 0%, #eef2f9 100%);
}

.page-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -160px);
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6d7a96;
}

.login-card {
  width: min(100%, 420px);
  padding: 28px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(10px);
  position: relative;
}

.login-card h1 {
  margin: 0;
  color: #111827;
  font-size: 1.8rem;
  line-height: 1.2;
  font-weight: 700;
}

.subtitle {
  margin-top: 8px;
  color: #5b6475;
  font-size: 0.95rem;
}

.login-form {
  display: grid;
  gap: 16px;
  margin-top: 24px;
}

.field {
  display: grid;
  gap: 8px;
  color: #334155;
  font-size: 0.92rem;
  font-weight: 600;
  min-width: 0;
}

.field input {
  display: block;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  height: 46px;
  border: 1px solid #d7deea;
  border-radius: 12px;
  padding: 0 14px;
  outline: none;
  background: #fff;
  color: #0f172a;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input::placeholder {
  color: #9aa4b2;
}

.field input:focus {
  border-color: #7c8cff;
  box-shadow: 0 0 0 3px rgba(124, 140, 255, 0.16);
}

.password-wrapper {
  position: relative;
  width: 100%;
  min-width: 0;
}

.password-wrapper input {
  width: 100%;
  max-width: 100%;
  padding-right: 48px;
}

.eye,
.eye {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  user-select: none;
}

.eye:hover {
  background: rgba(100, 116, 139, 0.1);
}

.submit-button {
  height: 46px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(180deg, #6d7cff 0%, #5668f5 100%);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(86, 104, 245, 0.25);
}

.submit-button:hover {
  filter: brightness(1.03);
}

@media (max-width: 480px) {
  .login-card {
    padding: 22px;
    border-radius: 16px;
  }

  .login-card h1 {
    font-size: 1.5rem;
  }
}
</style>
