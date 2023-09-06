<template lang="pug">
app-modal(@close="close")
  template(#content)
    .auth
      h1 Create Account
      button.google Sign up with Google
      h2 Or continue with
      form(@submit.prevent="submit")
        .form-group(:class="getValidationClass($v, 'username')") 
          label(for="username") Name
          input#InputName(
            v-model="form.username",
            placeholder="Type your username",
            type="username",
            @blur="$v.username.$touch()"
          )
          span(v-if="$v.username.required.$invalid") This field is required.
        .form-group(:class="getValidationClass($v, 'email')")
          label(for="email") Email Adress
          input#InputEmail(
            v-model="form.email",
            placeholder="Type your email address",
            type="email",
            @blur="$v.email.$touch()"
          )
          span(v-if="$v.email.required.$invalid") This field is required.
          span(v-else-if="$v.email.email.$invalid") Please enter a valid email address.
        .form-group.distance(:class="getValidationClass($v, 'password')")
          label(for="password") Password
          input#password(
            v-model="form.password",
            placeholder="******",
            :type="passwordVisible ? 'text' : 'password'",
            @blur="$v.password.$touch()"
          )
          span.password-toggle(@click="passwordVisible = !passwordVisible") 
            i(:class="[passwordVisible ? 'password-show' : 'password-hide']") 
          span.error-message(v-if="$v.password.required.$invalid") This field is required.
          span.error-message(v-else-if="$v.password.minLength.$invalid") Password must be at least 8 characters long.
        button.log-in Sign Up
          i.loader(v-if="isLoading")
        .block 
          p New User?
          button.sign-up(@click="signUp") Sign Up
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { AxiosResponse } from "axios";
import AppModal from "./AppModal";
import router from "@/router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { getValidationClass, checkValidation } from "@/types/authValidation";
import {
  AuthUserInterface,
  CreateUserInterface,
  ResUser,
} from "@/types/userApiInterface";
import userApi, { registerUser } from "@/services/api/userApi";
const passwordVisible = ref(false);
const isLoading = ref(false);
interface RegistrationData {
  username: string;
  email: string;
  password: string;
  role: string;
}

const defaultStateRegister: RegistrationData = {
  username: "",
  email: "",
  password: "",
  role: "Authentication",
};

const form = ref<RegistrationData>({
  ...defaultStateRegister,
});
const rules = computed(() => {
  const rules: any = {
    email: { required, email },
    password: { required, minLength: minLength(8) },
    username: { required },
  };
  return rules;
});

const $v = useVuelidate(rules, form);

const submit = async () => {
  isLoading.value = true;
  if (checkValidation($v.value)) {
    isLoading.value = false;
    return;
  }
  registerUser(form.value).then((res: AxiosResponse<{ data: ResUser }>) => {
    isLoading.value = false;
    if (res) {
      console.log(res);
      close();
    }
  });
};
const close = () => {
  emit("close");
};
const emit = defineEmits(["close"]);
// onMounted(() => {
//   localStorage.removeItem("isAuthenticated");
// });
</script>

<style lang="scss">
@import "../scss/auth.scss";
</style>
