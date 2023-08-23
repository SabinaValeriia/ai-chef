<template lang="pug">
teleport(to="body")
  .modal
    .modal--backdrop(@click="close")
    .modal--container
      .modal--wrapper
        .modal--close(@click="close")
        slot(name="content")
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, inject, onBeforeUnmount } from "vue";
import useDisableScroll from "@/features/useDisableScroll";

const emit = defineEmits(["close", "submit"]);
const props = defineProps({
  isOpen: { type: Boolean, default: false },
});
let openWindow = inject("openWindow");
console.log(openWindow);
function close() {
  emit("close");
}

const keyPress = (event: KeyboardEvent) => {
  if (event && event.code === "Escape") {
    close();
  }
};
useDisableScroll();
document.addEventListener("keydown", keyPress);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", keyPress);
});
</script>

<style lang="scss" scoped>
.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;

  &--backdrop {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #000000;
    top: 0;
    left: 0;
    opacity: 0.4;
  }

  &--container {
    max-height: 100%;
    overflow-y: auto;
    padding: 60px;
    z-index: 11;
  }

  &--wrapper {
    position: relative;
    background-color: #ffffff;
    border-radius: 28px;
    padding: 0 93px;
  }

  &--close {
    position: absolute;
    top: -36px;
    right: -40px;
    z-index: 9;
    background: url("../assets/img/close.svg");
    width: 36px;
    height: 36px;
  }

  &--loader {
    top: calc(50% - 90px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
