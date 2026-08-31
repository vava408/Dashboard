<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-mark">AP</div>
      <div><strong>AirPanel <span>Pro</span></strong><small>SERVER CONTROL</small></div>
    </div>

    <nav class="side-nav" aria-label="Navigation principale">
      <p class="nav-label">Workspace</p>
      <RouterLink to="/home" class="nav-item active"><span class="nav-icon">▦</span>Dashboard</RouterLink>
      <p class="nav-label">Monitoring</p>
      <a class="nav-item" href="/systheme"><span class="nav-icon">◒</span>Système</a>
      <a class="nav-item" href="#monitoring"><span class="nav-icon">⌁</span>Réseau</a>
      <a class="nav-item" href="#monitoring"><span class="nav-icon">◫</span>Stockage</a>
      <p class="nav-label">Gestion</p>
      <a class="nav-item" href="#bots"><span class="nav-icon">◉</span>Bots Discord <span class="nav-count">4</span></a>
      <a class="nav-item" href="/pm2"><span class="nav-icon">◌</span>PM2</a>
      <a class="nav-item" href="#docker"><span class="nav-icon">◈</span>Docker</a>
      <a class="nav-item" href="#fichiers"><span class="nav-icon">□</span>Fichiers</a>
    </nav>

    <div class="sidebar-footer">
      <a class="nav-item" href="#logs"><span class="nav-icon">≡</span>Logs</a>
      <a class="nav-item" href="#settings"><span class="nav-icon">⚙</span>Paramètres</a>
      <div class="user-chip"><span class="avatar">VP</span><span><strong>Valentin</strong><small>Administrateur</small></span><span class="more">•••</span></div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar { width: 228px; flex: none; display: flex; flex-direction: column; padding: 24px 14px 18px; border-right: 1px solid #1b2637; background: #0b111c; }
.brand { display: flex; align-items: center; gap: 10px; padding: 0 10px 34px; }
.brand-mark { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; color: #fff; font-size: 10px; font-weight: 800; background: linear-gradient(135deg, #7056ef, #3b9cff); box-shadow: 0 6px 16px #4d4ad066; }
.brand strong { display: block; font-size: 12px; letter-spacing: .02em; }
.brand strong span { color: #a9b2ca; }
.brand small, .user-chip small { display: block; color: #68758d; font-size: 8px; letter-spacing: .09em; }
.side-nav { display: grid; gap: 4px; }
.nav-label { margin: 16px 10px 5px; color: #56647b; font-size: 9px; text-transform: uppercase; letter-spacing: .14em; }
.nav-label:first-child { margin-top: 0; }
.nav-item { display: flex; align-items: center; gap: 10px; min-height: 33px; padding: 0 10px; color: #7e8ca4; font-size: 11px; text-decoration: none; border-radius: 6px; transition: .2s; }
.nav-item:hover, .nav-item.active { color: #fff; background: #25205b; }
.nav-item.active { box-shadow: inset 2px 0 #7c63ff; }
.nav-icon { width: 15px; color: #8995ad; text-align: center; font-size: 13px; flex: none; }
.nav-count { margin-left: auto; color: #a8b6d1; font-size: 10px; }
.sidebar-footer { margin-top: auto; }
.user-chip { display: flex; align-items: center; gap: 8px; margin-top: 20px; padding: 12px 8px; border-top: 1px solid #1a2535; color: #eef3ff; }
.user-chip strong { display: block; font-size: 10px; }
.avatar { display: grid; place-items: center; width: 25px; height: 25px; border-radius: 50%; font-size: 9px; font-weight: 700; background: #2b3d6c; color: #bcd6ff; flex: none; }
.more { margin-left: auto; color: #69758a; }

@media (max-width: 1024px) {
  .sidebar { width: 200px; padding: 20px 12px 16px; }
  .brand { padding-bottom: 24px; }
  .nav-item { font-size: 10px; min-height: 32px; }
}

@media (max-width: 900px) {
  .sidebar { width: 100%; padding: 10px 14px 8px; border-right: 0; border-bottom: 1px solid #1b2637; }
  .brand { padding: 0; }
  .brand small { display: none; }
  .side-nav { display: flex; gap: 6px; order: 2; width: 100%; margin-top: 10px; overflow-x: auto; scrollbar-width: none; }
  .side-nav::-webkit-scrollbar { display: none; }
  .nav-label { display: none; }
  .nav-item { flex: 0 0 auto; min-height: 34px; padding: 0 11px; white-space: nowrap; font-size: 10px; background: #101826; border: 1px solid #1c293b; }
  .nav-item.active { border-color: #6d5ce7; }
  .nav-count { display: none; }
  .sidebar-footer { position: absolute; top: 10px; right: 14px; margin: 0; }
  .sidebar-footer > .nav-item { display: none; }
  .user-chip { margin: 0; padding: 0; border: 0; }
  .user-chip > span:not(.avatar) { display: none; }
  .avatar { width: 28px; height: 28px; }
  .more { display: none; }
}

@media (max-width: 560px) {
  .sidebar { padding: 9px 10px 8px; }
  .brand-mark { width: 28px; height: 28px; }
  .brand strong { font-size: 11px; }
  .side-nav { margin-top: 9px; gap: 5px; }
  .nav-item { min-height: 32px; padding: 0 10px; font-size: 9px; }
  .nav-icon { width: 13px; font-size: 12px; }
  .sidebar-footer { top: 9px; right: 10px; }
  .avatar { width: 26px; height: 26px; font-size: 8px; }
}
</style>
