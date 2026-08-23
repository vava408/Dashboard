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
      <a class="nav-item" href="#monitoring"><span class="nav-icon">◒</span>Système</a>
      <a class="nav-item" href="#monitoring"><span class="nav-icon">⌁</span>Réseau</a>
      <a class="nav-item" href="#monitoring"><span class="nav-icon">◫</span>Stockage</a> 
      <p class="nav-label">Gestion</p>
      <a class="nav-item" href="#bots"><span class="nav-icon">◉</span>Bots Discord <span class="nav-count">4</span></a>
      <a class="nav-item" href="#processus"><span class="nav-icon">◌</span>PM2</a>
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
.sidebar{width:228px;flex:none;display:flex;flex-direction:column;padding:24px 14px 18px;border-right:1px solid #1b2637;background:#0b111c}.brand{display:flex;align-items:center;gap:10px;padding:0 10px 34px}.brand-mark{display:grid;place-items:center;width:30px;height:30px;border-radius:9px;color:#fff;font-size:10px;font-weight:800;background:linear-gradient(135deg,#7056ef,#3b9cff);box-shadow:0 6px 16px #4d4ad066}.brand strong{display:block;font-size:12px;letter-spacing:.02em}.brand strong span{color:#a9b2ca}.brand small,.user-chip small{display:block;color:#68758d;font-size:8px;letter-spacing:.09em}.side-nav{display:grid;gap:4px}.nav-label{margin:16px 10px 5px;color:#56647b;font-size:9px;text-transform:uppercase;letter-spacing:.14em}.nav-label:first-child{margin-top:0}.nav-item{display:flex;align-items:center;gap:10px;min-height:33px;padding:0 10px;color:#7e8ca4;font-size:11px;text-decoration:none;border-radius:6px;transition:.2s}.nav-item:hover,.nav-item.active{color:#fff;background:#25205b}.nav-item.active{box-shadow:inset 2px 0 #7c63ff}.nav-icon{width:15px;color:#8995ad;text-align:center;font-size:13px}.nav-count{margin-left:auto;color:#a8b6d1;font-size:10px}.sidebar-footer{margin-top:auto}.user-chip{display:flex;align-items:center;gap:8px;margin-top:20px;padding:12px 8px;border-top:1px solid #1a2535;color:#eef3ff}.user-chip strong{display:block;font-size:10px}.avatar{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;font-size:9px;font-weight:700;background:#2b3d6c;color:#bcd6ff}.more{margin-left:auto;color:#69758a}@media (max-width:900px){.sidebar{width:64px;padding-inline:8px}.brand{padding-inline:10px}.brand>div:last-child,.nav-item:not(.active) .nav-count,.nav-item{font-size:0}.nav-item{justify-content:center;padding:0}.nav-icon{font-size:14px}.user-chip{justify-content:center}.user-chip>span:not(.avatar){display:none}}
</style>
