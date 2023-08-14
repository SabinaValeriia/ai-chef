<template lang="pug">
.container 
  .header
    img(:src="require('../assets/img/logo.png')")
    .header--buttons 
      button.sign-in(@click="openSign") Sign In
      button.create-acc(@click="openRegistr") Create account
auth-modal(
  v-if="opensSign",
  @closeModalLogin="closeModalLogin",
  @close="close"
)
register-modal(
  v-if="opensRegister",
  @closeModalRegister="closeModalRegister",
  @close="close"
)
</template>

<script setup lang="ts">
import AuthModal from "./AuthModal.vue";
import RegisterModal from "./RegisterModal.vue";
import { provide, ref } from "vue";
const opensSign = ref(false);
const openSign = () => {
  opensSign.value = true;
};
const opensRegister = ref(false);
const openRegistr = () => {
  opensRegister.value = true;
};
const closeModalLogin = () => {
  opensSign.value = false;
};
const closeModalRegister = () => {
  opensRegister.value = false;
};
const close = () => {
  opensSign.value = false;
  opensRegister.value = false;
};
</script>

<style lang="scss">
.header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &--buttons {
    .sign-in {
      padding: 14px 20px 14px 20px;
      border-radius: 8px;
      border: none;
      background: #d0dbbd;
      cursor: pointer;

      font-family: var(--font-inter);
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0em;
      color: #020203;
    }
    .create-acc {
      padding: 14px 20px 14px 20px;
      margin-left: 12px;
      border-radius: 8px;
      border: none;
      background: #7f4a87;
      cursor: pointer;

      font-family: var(--font-inter);
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0em;
      color: #f7f5fa;
    }
  }
}
</style>
