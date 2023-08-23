<template lang="pug">
div(v-if="isAuthenticated")
  .container 
    .header
      .icon.icon-logo.icon-logo-green
      .header--buttons
        button.create-acc Create dish
        button.transparent-btn
          .icon.icon-comments 
          a Comments
        button.transparent-btn
          .icon.icon-account 
          router-link(:to="{ name: 'details' }") {{ name }}
div(v-else)
  .container 
    .header
      .icon.icon-logo
      .header--buttons 
        button.sign-in(@click="openSign") Sign In
        button.create-acc(@click="openRegistr") Create account
  auth-modal(v-if="opensSign", @close="close", @isAuth="isAuth")
  register-modal(v-if="opensRegister", @close="close")
</template>

<script setup lang="ts">
import userApi from "@/services/api/userApi";
import { setToken, getToken } from "@/services/api/userApi";
import AuthModal from "./AuthModal.vue";
import RegisterModal from "./RegisterModal.vue";
import { provide, ref, onMounted } from "vue";
import { computed } from "vue";
const opensSign = ref(false);
const openSign = () => {
  opensSign.value = true;
};
const opensRegister = ref(false);
const openRegistr = () => {
  opensRegister.value = true;
};
const close = () => {
  opensSign.value = false;
  opensRegister.value = false;
};
const isAuthenticated = ref(false);
onMounted(() => {
  if (localStorage.getItem("isAuthenticated")) {
    isAuthenticated.value = true;
    const jwtToken = localStorage.getItem("isAuthenticated");
    const headers = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    userApi.showUsers(headers).then((res) => {
      users.value = res.data;
    });
  } else {
    isAuthenticated.value = false;
  }
});
const name = computed(() => {
  if (users.value.name && users.value.surname) {
    return users.value.name + " " + users.value.surname;
  } else {
    return users.value.username;
  }
});
const users = ref({});
</script>

<style lang="scss">
@import "../scss/styles.scss";
.header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &--buttons {
    display: flex;
    .transparent-btn {
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      margin-left: 34px;
      a {
        color: #020203;
        font-family: var(--font-inter);
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        margin-left: 8px;
        text-decoration: none;
      }
    }
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
      width: 148px;
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
