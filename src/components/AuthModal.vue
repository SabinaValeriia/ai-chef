<template lang="pug">
app-modal
  template(#content)
    .auth
      button.close(@click="close")
      h1 Log In
      button.google Sign up with Google
      h2 Or continue with
      form(@submit.prevent="submit")
        .form-group(:class="getValidationClass($v, 'identifier')")
          label(for="email") Email Adress
          input#InputEmail(
            v-model="form.identifier",
            placeholder="Type your email address",
            type="email"
          )
          span(v-if="$v.identifier.$dirty && $v.identifier.required.$invalid") This field is required.
          span(v-else-if="$v.identifier.$dirty && $v.identifier.$invalid") Please enter a valid email address.
        .form-group(:class="getValidationClass($v, 'password')")
          label(for="password") Password
          input#password(
            v-model="form.password",
            placeholder="******",
            :type="passwordVisible ? 'text' : 'password'"
          )
          span.password-toggle(@click="passwordVisible = !passwordVisible") 
            i(:class="[passwordVisible ? 'password-show' : 'password-hide']") 
          span.error-message(
            v-if="$v.password.$dirty && $v.password.required.$invalid"
          ) This field is required.
          span.error-message(
            v-else-if="$v.password.$dirty && $v.password.$invalid"
          ) Password must be at least 8 characters long.
        button.log-in Log In
        .block 
          p New User?
          button.sign-up(@click="signUp") Sign Up
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import AppModal from "./AppModal.vue";
import router from "@/router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { getValidationClass, checkValidation } from "@/types/authValidation";
import {
  AuthUserInterface,
  CreateUserInterface,
} from "@/types/userApiInterface";
import userApi from "@/services/api/userApi";
const passwordVisible = ref(false);
const registration = ref(false);
const signUp = () => {
  emit("close");
};
interface LoginData {
  identifier: string;
  password: string;
}

const defaultState: LoginData = {
  identifier: "",
  password: "",
};

const form = ref<LoginData>({
  ...defaultState,
});

const rules = computed(() => {
  const rules: any = {
    identifier: { required, email },
    password: { required, minLength: minLength(8) },
  };
  return rules;
});

const $v = useVuelidate(rules, form);

const submit = async () => {
  if (checkValidation($v.value)) {
    return;
  }
  userApi.loginUser(form.value).then((res: AuthUserInterface) => {
    if (res) {
      const authToken = res.data.jwt;
      localStorage.setItem("isAuthenticated", authToken);
      console.log(res);
      emit("closeModalLogin");
    }
  });
};
const close = () => {
  emit("close");
};
const emit = defineEmits(["closeModalLogin", "close"]);
</script>

<style lang="scss">
@import "../scss/auth.scss";
</style>
