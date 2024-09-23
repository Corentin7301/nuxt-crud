<template>
  <div>
    Nuxt module playground!
    <pre>{{ data }}</pre>
    <pre>{{ user }}</pre>
    <pre>{{ test }}</pre>
  </div>
</template>

<script setup>
const { data } = await useFetch('/api/customer')
const { data:user } = await useFetch('/api/user/index.get')
// const { data:test } = await useFetch('/api/test/index.get')
</script>
