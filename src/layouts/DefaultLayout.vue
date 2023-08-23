<template lang="pug">
.block
  header-component(@open="openModal")
  router-view
</template>
<script setup lang="ts">
import HeaderComponent from "@/components/HeaderComponent.vue";
import { provide, ref } from "vue";
const emit = defineEmits(["open"]);
const open = ref(false);
const openModal = (openWindow: boolean) => {
  console.log(openWindow);
  open.value = openWindow;
  emit("open", openWindow);
};

provide("openWindow", open.value);
</script>
