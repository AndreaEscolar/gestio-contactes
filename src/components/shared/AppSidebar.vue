<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-name">📞 Contactes</div>
      <div class="brand-sub">Projecte RA2</div>
    </div>
    <nav>
      <RouterLink to="/contacts" class="nav-item">
        <i class="pi pi-users"></i> Contactes
      </RouterLink>
      <RouterLink to="/groups" class="nav-item">
        <i class="pi pi-sitemap"></i> Grups
      </RouterLink>
      <RouterLink to="/history" class="nav-item">
        <i class="pi pi-history"></i> Historial
      </RouterLink>
      <RouterLink to="/stats" class="nav-item">
        <i class="pi pi-chart-bar"></i> Estadístiques
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// Vue Router gestiona el estado activo automáticamente
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  position: fixed; top: 0; left: 0; bottom: 0;
  padding: 18px 10px;
  display: flex; flex-direction: column; gap: 4px;
  z-index: 100;
}
.brand { padding: 0 10px 16px; border-bottom: 1px solid var(--color-border); margin-bottom: 8px; }
.brand-name { font-size: 15px; font-weight: 600; }
.brand-sub { font-size: 11px; color: var(--color-muted); margin-top: 2px; }
.nav-item {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 10px; border-radius: 8px;
  font-size: 13px; color: var(--color-muted);
  text-decoration: none; transition: var(--transition);
}
.nav-item:hover { background: var(--color-bg); color: var(--color-text); }
.nav-item.router-link-active {
  background: #eff6ff;
  color: var(--color-primary);
  font-weight: 500;
}
</style>