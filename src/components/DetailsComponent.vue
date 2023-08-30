<template lang="pug">
.details--blocks 
  .details--block
    h1 Basic
    button.btn-purple(@click="save") Save
    form(@submit.prevent="submit")
      .form-group(:class="getValidationClass($v, 'name')")
        label(for="name") Name
        input#InputName(
          v-model="form.name",
          type="text",
          :placeholder="form.name ? '' : 'Type your name'",
          autocomplete="off",
          :class="{ 'filled-input': form.name }",
          @blur="$v.name.$touch()"
        )
        span(v-if="$v.name.required.$invalid") This field is required.
        span(v-else-if="$v.name.minLength.$invalid") Surname must be at least 3 characters long..
      .form-group(:class="getValidationClass($v, 'surname')")
        label(for="surname") Surname
        input#InputSurname(
          v-model="form.surname",
          type="text",
          :placeholder="form.surname ? '' : 'Type your surname'",
          autocomplete="off",
          :class="{ 'filled-input': form.surname }",
          @blur="$v.surname.$touch()"
        )
        span(v-if="$v.surname.required.$invalid") This field is required.
        span(v-else-if="$v.surname.minLength.$invalid") Please enter a valid email address.

      .form-group(:class="getValidationClass($v, 'dateOfBirth')")
        label(for="dateOfBirth") Birthday
        .date-dropdowns
          custom-dropdown(
            :items="daysOptions",
            :value="selectedDays",
            props-class="day",
            @select="selectDay"
          )
          custom-dropdown(
            :items="monthsOptions",
            :value="selectedMonths",
            :props-class="month",
            @select="selectMonth"
          )
          custom-dropdown(
            :items="yearsOptions",
            :value="selectedYears",
            :props-class="year",
            @select="selectYear"
          )
        span(v-if="$v.dateOfBirth.required.$invalid") This field is required.
      .form-group(:class="getValidationClass($v, 'gender')")
        label(for="gender") Gender
        .date-dropdowns
          custom-dropdown(
            :items="gendersOptions",
            :value="selectedGenders",
            :props-class="gender",
            @select="selectGender"
          )
          span(v-if="$v.gender.required.$invalid") This field is required.
      .form-group(:class="getValidationClass($v, 'country')")
        label(for="country") Country
        input(
          v-model="form.country",
          type="text",
          autocomplete="off",
          :placeholder="form.country ? '' : 'Type your country'",
          :class="{ 'filled-input': form.country }",
          @blur="$v.country.$touch()"
        )
        span(v-if="$v.country.required.$invalid") This field is required.
        span(v-else-if="$v.country.minLength.$invalid") Please enter a valid country.
      .form-group(:class="getValidationClass($v, 'city')")
        label(for="city") City
        input(
          v-model="form.city",
          type="text",
          :placeholder="form.city ? '' : 'Type your city'",
          autocomplete="off",
          :class="{ 'filled-input': form.city }",
          @blur="$v.city.$touch()"
        )
        span(v-if="$v.city.required.$invalid") This field is required.
        span(v-else-if="$v.city.minLength.$invalid") Please enter a valid city.
      .form-group(:class="getValidationClass($v, 'adress')")
        label(for="adress") Adress
        input(
          v-model="form.adress",
          type="text",
          autocomplete="off",
          :placeholder="form.adress ? '' : 'Type your adress'",
          :class="{ 'filled-input': form.adress }",
          @blur="$v.adress.$touch()"
        )

        span(v-if="$v.adress.required.$invalid") This field is required.
        span(v-else-if="$v.adress.minLength.$invalid") Please enter a valid adress.

  .details--block
    h1 Security
    form(@submit.prevent="submit")
      .form-group
        label(for="email") Email
        input#InputEmail(
          :placeholder="emailAdress || 'Type your email'",
          type="email"
        )
      .form-group
        label(for="email") Password
        input#InputEmail(placeholder="*************", type="email")
        span.password-toggle(@click="passwordVisible = !passwordVisible") 
          i(:class="[passwordVisible ? 'password-show' : 'password-hide']") 
      .form-group
        label(for="email") Reenter password
        input#InputEmail(placeholder="*************", type="email")
        span.password-toggle(@click="passwordVisible = !passwordVisible") 
          i(:class="[passwordVisible ? 'password-show' : 'password-hide']")
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRaw } from "vue";
import { AxiosResponse } from "axios";
import AppModal from "../modals/AppModal.vue";
import router from "@/router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { getValidationClass, checkValidation } from "@/types/authValidation";
import {
  AuthUserInterface,
  CreateUserInterface,
  ResUser,
} from "@/types/userApiInterface";
import userApi from "@/services/api/userApi";
import CustomDropdown from "@/components/CustomDropdown.vue";
import { useAuthStore } from "@/store/auth";
const passwordVisible = ref(false);
const registration = ref(false);
const emit = defineEmits(["close", "isAuth"]);
const signUp = () => {
  emit("close");
};

const isAuthenticated = ref(false);

const users = ref({});
const selectedDay = ref("");
const selectedMonth = ref("");
const daysOptions = Array.from({ length: 31 }, (_, index) => index + 1);
enum monthsOptions {
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
}
const day = ref("day");
const month = ref("month");
const year = ref("year");
const gender = ref("gender");

const gendersOptions = ref(["male", "female"]);

const isDropdownOpenYear = ref(false);
const isDropdownOpenMonth = ref(false);
const isDropdownOpenDay = ref(false);
const selectedYear = ref("");
const selectedGender = ref("");
const yearsOptions = Array.from(
  { length: 100 },
  (_, index) => new Date().getFullYear() - index
);

const selectedYears = computed(() => {
  return selectedYear.value || "year";
});
const selectedDays = computed(() => {
  return selectedDay.value || "day";
});
const selectedMonths = computed(() => {
  return selectedMonth.value || "month";
});
const selectedGenders = computed(() => {
  return selectedGender.value || "gender";
});
const selectedDate = ref("");

const selectYear = (day) => {
  selectedYear.value = day;
  updateSelectedDate();
};

const selectDay = (day) => {
  selectedDay.value = day < 10 ? `0${day}` : day;
  updateSelectedDate();
};

const selectMonth = (day) => {
  const monthIndex = monthsOptions[day];
  if (monthIndex !== undefined) {
    selectedMonth.value = String(monthIndex + 1).padStart(2, "0");
    updateSelectedDate();
  }
};
const updateSelectedDate = () => {
  selectedDate.value = `${selectedYear.value || "year"}-${
    selectedMonth.value ? selectedMonth.value : "month"
  }-${selectedDay.value || "day"}`;
  form.value.dateOfBirth = selectedDate.value;
  console.log(form.value.dateOfBirth);
};
const selectGender = (day) => {
  selectedGender.value = day;
  form.value.gender = selectedGender.value;
  console.log(form.value.gender);
};
interface LoginData {
  name: string;
  surname: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  city: string;
  adress: string;
}

const defaultState: LoginData = {
  name: "",
  surname: "",
  dateOfBirth: "",
  gender: "",
  country: "",
  city: "",
  adress: "",
};
const form = ref<LoginData>({
  ...defaultState,
});
console.log(form.value.dateOfBirth);

const props = defineProps({
  file: String,
});

const genders = ref("");
const auth = useAuthStore();

auth.showUser();

const save = () => {
  if (checkValidation($v.value)) {
    return;
  }
  const genderId = form.value.gender === "male" ? 5 : 4;
  console.log(genderId);
  let data = {
    name: form.value.name,
    surname: form.value.surname,
    dateOfBirth: form.value.dateOfBirth,
    country: form.value.country,
    adress: form.value.adress,
    city: form.value.city,
    img: { name: props.file.name },
    gender: {
      id: genderId,
      gender: form.value.gender,
    },
  };
  console.log("image", data.img);
  userApi
    .updateUser(auth.id, data)
    .then((res) => {
      console.log("res", res);
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};

const rules = computed(() => {
  const rules: any = {
    name: { required, minLength: minLength(3) },
    surname: { required, minLength: minLength(3) },
    dateOfBirth: { required },
    gender: { required },
    country: { required, minLength: minLength(3) },
    city: { required, minLength: minLength(3) },
    adress: { required, minLength: minLength(3) },
  };
  return rules;
});

const $v = useVuelidate(rules, form);

const close = () => {
  emit("close");
};
</script>

<style lang="scss">
.details--blocks {
  display: flex;
  gap: 104px;
  padding-bottom: 43px;
  position: relative;
  .details--block {
    width: 460px;
    button {
      position: absolute;
      top: -81px;
      right: 0;
    }
    h1 {
      color: var(--secondary-bt-1);
      text-align: center;
      font-family: var(--font-inter);
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: 30px;
      margin: 0;
      text-align: left;
    }
    form {
      .form-group {
        display: flex;
        flex-direction: column;
        position: relative;
        &.error {
          .dropdown-toggle {
            border: 1px solid red !important;
          }
          span {
            color: red;
            font-family: var(--font-inter);
            font-size: 14px;
            font-style: normal;
            font-weight: 300;
            line-height: 20px;
            margin: 4px 0 0 0;
          }
          input {
            border: 1px solid red;
          }
        }
        label {
          color: var(--secondary-bt-1);
          font-family: var(--font-inter);
          font-size: 14px;
          font-style: normal;
          font-weight: 300;
          line-height: 20px;
          margin: 10px 0 8px;
        }
        input {
          border-radius: 8px;
          border: 1px solid var(--secondary-bc-1);
          background: #fff;
          padding: 14px 16px;
          outline: none;
          font-family: var(--font-inter);
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 24px;
          color: var(--secondary-bt-1);
          &:hover {
            border: 1px solid var(--default-c-1);
          }
          &:active {
            border: 1px solid var(--default-c-1);
          }
          &.filled-input {
            background: #f7f7f7;
          }
          &::placeholder {
            color: var(--secondary-bt-1);
            font-family: var(--font-inter);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
          }
        }

        .password-toggle {
          background: url("../assets/img/visible.svg");
          display: block;
          position: absolute;
          top: 53px;
          right: 16px;
          width: 16px;
          height: 16px;
          .password-show {
            border-top: 1px solid black;
            width: 16px;
            transform: rotate(45deg);
            display: block;
            margin-top: 7px;
          }
        }
        .date-dropdowns {
          display: flex;
          gap: 10px;
          .gender {
            width: 100%;
          }
          ul {
            list-style: none;
            margin: 14px 0 0 0;
            padding: 0;
            z-index: 2;
            overflow: auto;
            display: none;
            max-height: 158px;
            li {
              border-bottom: 1px solid var(--secondary-bc-1);
              padding: 14px 16px;
              color: var(--secondary-bt-1);
              font-family: var(--font-inter);
              font-size: 16px;
              font-style: normal;
              font-weight: 400;
              line-height: 24px;
              cursor: pointer;
            }
            &.active {
              display: block;
              position: absolute;
              background: white;
              z-index: 4;
              margin: 0;
              display: block;
              margin: -4px 0;
              border-radius: 0 0 8px 8px;
              border-bottom: 1px solid var(--secondary-bc-1);
              border-left: 1px solid var(--secondary-bc-1);
              border-right: 1px solid var(--secondary-bc-1);
            }
            &.active.day {
              width: 86px;
            }
            &.active.month {
              width: 236px;
            }
            &.active.year {
              width: 111px;
            }
            &.active.gender {
              width: 100%;
            }
          }
          .dropdown-toggle {
            border-radius: 8px;
            border: 1px solid var(--secondary-bc-1);
            background: #fff;
            padding: 14px 0;
            position: relative;
            &.active {
              z-index: 5;
            }
            &.day {
              width: 87px;
              ul {
                width: 87px;
              }
            }
            &.gender {
              width: 100%;
            }
            &.year {
              width: 113px;
              ul {
                width: 111px;
              }
            }
            &.month {
              width: 238px;
              ul {
                width: 236px;
              }
            }
            &.gender {
              width: 100%;
              ul {
                width: 99%;
              }
            }
            &.active {
              p::after {
                transform: rotate(180deg);
              }
            }
            p {
              color: var(--secondary-bt-1);
              font-family: var(--font-inter);
              font-size: 16px;
              font-style: normal;
              font-weight: 400;
              line-height: 24px;
              margin: 0 0 0 16px;
              display: flex;
              align-items: center;
              position: relative;
              &::after {
                content: "";
                display: inline-block;
                background: url("../assets/img/arrow.svg");
                width: 16px;
                height: 16px;
                right: 16px;
                position: absolute;
              }
            }
          }
        }
      }
    }
  }
}
</style>
