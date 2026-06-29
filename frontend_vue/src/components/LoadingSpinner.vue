<template>
  <div style="display:grid; place-items:center; padding: 2rem">
    <div class="spinner" />
  </div>
</template>

<style scoped>
.spinner {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 4px solid rgba(15, 118, 110, 0.15);
  border-top-color: #0f766e;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
