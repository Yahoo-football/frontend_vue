<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const showChrome = computed(() => router.currentRoute.value.name !== 'welcome')

onMounted(() => {
  if (!auth.initialized) auth.bootstrap()
})
</script>

<template>
  <div>
    <AppNavbar v-if="showChrome" />
    <main class="page-shell" style="padding: 28px 0 48px">
      <slot />
    </main>
  </div>
</template>
