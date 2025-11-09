<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: "en",
  },
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ],
});

useSeoMeta({
  charset: "utf-8",
  title: "this_is_sigma_bot",
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
