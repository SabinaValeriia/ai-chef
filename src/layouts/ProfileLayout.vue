<template lang="pug">
header-component
.container 
  .profile--details 
    button.back(@click="goBack")
      .icon.icon-arrow 
      p Back
    .profile--details-block
      .image-container(@click="triggerImageSelection")
        .image-block
          img.profile-image(:src="imageSource", v-if="defaultImage")
          input(
            type="file",
            ref="fileInput",
            style="display: none",
            @change="handleFileChange"
          )
        img(:src="require(`../assets/img/${imagePath}`)", v-if="isImage")
        button.btn-green(@click="logOut") Log out
      .distance
        h1 {{ name }}
        h3 Tell us about yourself here
        h2(
          v-if="users.city || users.adress || users.adress || users.dateOfBirth || (users.city && users.adress && users.adress && users.dateOfBirth)"
        ) {{ users.gender.gender }}, {{ age }} | {{ users.country }}, {{ users.city }}
        h2(v-else) Age | City, State, country
  router-view(:file="file")
</template>

<script setup lang="ts">
import HeaderComponent from "@/components/HeaderComponent.vue";
import router from "@/router";
import userApi from "@/services/api/userApi";
import { computed, provide } from "vue";
import { onMounted, ref } from "vue";
const isAuthenticated = ref(false);
const users = ref({});
const goBack = () => {
  router.go(-1);
};
const logOut = () => {
  localStorage.removeItem("isAuthenticated");
  router.go(-1);
};

const imagePath = ref("");
const defaultPath = ref("");
const fileInput = ref(null);

const imageSource = computed(() => {
  if (users.value.img && users.value.img) {
    return require(`../assets/img/${defaultPath.value}`);
  }
  return null;
});

const isImage = ref(false);
const defaultImage = ref(true);

const triggerImageSelection = () => {
  fileInput.value.click();
};
let file = ref({});
const handleFileChange = (event) => {
  file.value = event.target.files[0];
  console.log(file);
  imagePath.value = file.value.name;
  isImage.value = true;
  defaultImage.value = false;
  console.log("res", imagePath.value);
};
console.log(file);

const name = computed(() => {
  if (users.value.name && users.value.surname) {
    return users.value.name + " " + users.value.surname;
  } else {
    return users.value.username;
  }
});
const age = computed(() => {
  const birthdate = users.value.dateOfBirth;
  const birthYear = new Date(birthdate).getFullYear();
  const currentYear = new Date().getFullYear();

  return currentYear - birthYear;
});

isAuthenticated.value = true;
const jwtToken = localStorage.getItem("isAuthenticated");
const headers = {
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
};
userApi.showUsers(headers).then((res) => {
  users.value = res.data;
  defaultPath.value = users.value.img.name;
});
</script>

<style lang="scss">
@import "../scss/auth.scss";
.profile--details {
  img {
    margin-bottom: 10px;
  }
  button.back {
    color: #020203;
    font-family: var(--font-inter);
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    display: flex;
    align-items: center;
    margin: 26px 0 30px;
    background: transparent;
    border: none;
    .icon {
      background-color: #020203;
    }
    p {
      margin: 0;
    }
  }
  &-block {
    display: flex;
    h1 {
      color: var(--secondary-bt-1);
      font-family: var(--font-inter);
      font-size: 28px;
      font-style: normal;
      font-weight: 700;
      line-height: 32px;
      width: 195px;
      margin: 21px 0 0;
    }
    h2 {
      color: var(--secondary-bt-1);
      font-family: var(--font-inter);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      margin: 0;
    }
    h3 {
      color: var(--subtitle-color);
      font-family: var(--font-inter);
      font-size: 12px;
      font-style: normal;
      font-weight: 300;
      line-height: 16px;
      margin: 8px 0;
    }
    .distance {
      margin-left: 30px;
    }
    .image-container {
      display: inline-block;
      position: relative;

      img {
        height: 104px;
        width: 104px;
        border-radius: 56px;
      }
    }
    .image-container::after {
      content: "";
      display: inline-block;
      background: url("../assets/img/hover.svg");
      height: 36px;
      width: 36px;
      position: absolute;
      top: 33px;
      left: 33px;
    }
    .image-block::after {
      content: "";
      display: inline-block;
      border-radius: 58px;
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.4) 0%,
        rgba(0, 0, 0, 0.4) 100%,
        transparent 100%,
        transparent 100%
      );
      opacity: 1;
      transition: opacity 0.3s;
      height: 104px;
      width: 104px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
