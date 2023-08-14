<template lang="pug">
app-modal
  template(#content)
    .auth
      button.close(@click="close")
      h1 Create Account
      button.google Sign up with Google
      h2 Or continue with
      form(@submit.prevent="submit")
        .form-group(:class="getValidationClass($v, 'username')") 
          label(for="username") Name
          input#InputName(
            v-model="form.username",
            placeholder="Type your username",
            type="username"
          )
          span(v-if="$v.username.$dirty && $v.username.required.$invalid") This field is required.
        .form-group(:class="getValidationClass($v, 'email')")
          label(for="email") Email Adress
          input#InputEmail(
            v-model="form.email",
            placeholder="Type your email address",
            type="email"
          )
          span(v-if="$v.email.$dirty && $v.email.required.$invalid") This field is required.
          span(v-else-if="$v.email.$dirty && $v.email.$invalid") Please enter a valid email address.
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
        .form-group(:class="getValidationClass($v, 'role')")
          label(for="role") Role
          input#password(
            v-model="form.role",
            placeholder="Type your role",
            type="text"
          ) 
          span.error-message(
            v-if="$v.role.$dirty && $v.role.required.$invalid"
          ) This field is required.
        button.log-in Sign Up
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
  role: "",
};

const form = ref<RegistrationData>({
  ...defaultStateRegister,
});
const rules = computed(() => {
  const rules: any = {
    email: { required, email },
    password: { required, minLength: minLength(8) },
    username: { required, minLength: minLength(3) },
    role: { required, minLength: minLength(3) },
  };
  return rules;
});

const $v = useVuelidate(rules, form);

const submit = async () => {
  if (checkValidation($v.value)) {
    return;
  }
  userApi.registerUser(form.value).then((res: CreateUserInterface) => {
    if (res) {
      router.push({ name: "login" });
      console.log(res);
      emit("closeModalRegister");
    }
  });
};
const close = () => {
  emit("close");
};
const emit = defineEmits(["closeModalRegister", "close"]);
onMounted(() => {
  localStorage.removeItem("isAuthenticated");
});
</script>

<style lang="scss">
@import "../scss/auth.scss";
</style>
