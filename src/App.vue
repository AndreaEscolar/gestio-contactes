<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './components/shared/AppSidebar.vue'
</script>

<style>
:root {
  --color-primary: #2563eb;
  --color-surface: #ffffff;
  --color-bg: #f8fafc;
  --color-border: #e2e8f0;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --color-danger: #dc2626;
  --color-success: #166534;
  --color-warning: #f59e0b;
  --radius: 10px;
  --radius-sm: 6px;
  --shadow: 0 1px 3px rgba(0,0,0,.06);
  --sidebar-width: 220px;
  --transition: all 0.15s ease;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
}

.app-layout { display: flex; min-height: 100vh; }
.main-content { margin-left: var(--sidebar-width); flex: 1; padding: 28px 32px; }

.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
.page-header h1 { font-size: 22px; font-weight: 600; }

.p-inputtext, .p-select { width: 100%; }
.p-error { font-size: 12px; color: var(--color-danger); margin-top: 3px; }
</style>