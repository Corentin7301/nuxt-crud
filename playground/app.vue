<template>
  <div>
    Nuxt module playground!
    <pre>{{ data }}</pre>
  </div>
</template>

<script setup>
const { data } = await useFetch('/api/customer')
</script>
