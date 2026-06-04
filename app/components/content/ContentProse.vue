<script setup lang="ts">
defineProps<{
  value: Record<string, unknown>
}>()
</script>

<template>
  <MarkdownLightboxHost>
    <ContentRenderer :value="value" prose />
  </MarkdownLightboxHost>
</template>
