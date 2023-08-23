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
          @blur="$v.name.$touch()",
          :placeholder="form.name ? '' : 'Type your name'",
          autocomplete="off",
          :class="{ 'filled-input': form.name }"
        )
        span(v-if="$v.name.$dirty && $v.name.required.$invalid") This field is required.
        span(v-else-if="$v.name.$dirty && $v.name.minLength.$invalid") Surname must be at least 3 characters long..
      .form-group(:class="getValidationClass($v, 'surname')")
        label(for="surname") Surname
        input#InputSurname(
          v-model="form.surname",
          type="text",
          @blur="$v.surname.$touch()",
          :placeholder="form.surname ? '' : 'Type your surname'",
          autocomplete="off",
          :class="{ 'filled-input': form.surname }"
        )
        span(v-if="$v.surname.$dirty && $v.surname.required.$invalid") This field is required.
        span(v-else-if="$v.surname.$dirty && $v.surname.minLength.$invalid") Please enter a valid email address.

      .form-group(:class="getValidationClass($v, 'dateOfBirth')")
        label(for="dateOfBirth") Birthday
        .date-dropdowns
          div(@click="isDropdownOpenDay = !isDropdownOpenDay") 
            .dropdown-toggle.day(:class="[{ active: isDropdownOpenDay }]")
              p {{ selectedDays || "day" }}
            div 
              ul.dropdown-list.day(:class="[{ active: isDropdownOpenDay }]")
                li(
                  v-for="day in daysOptions",
                  :key="day",
                  @click="selectDay(day)"
                ) {{ day }}
          div(@click="isDropdownOpenMonth = !isDropdownOpenMonth")
            .dropdown-toggle.month(:class="[{ active: isDropdownOpenMonth }]") 
              p {{ selectedMonths.label || "month" }}
            div
              ul.dropdown-list.month(
                :class="[{ active: isDropdownOpenMonth }]"
              )
                li(
                  v-for="month in monthsOptions",
                  :key="month.label",
                  @click="selectMonth(month)"
                ) {{ month.label }}
          div(@click="isDropdownOpenYear = !isDropdownOpenYear")
            .dropdown-toggle.year(:class="[{ active: isDropdownOpenYear }]") 
              p {{ selectedYears || "year" }}
            div
              ul.dropdown-list.year(:class="[{ active: isDropdownOpenYear }]")
                li(
                  v-for="year in yearsOptions",
                  :key="year",
                  @click="selectYear(year)"
                ) {{ year }}
        span(v-if="$v.dateOfBirth.$dirty && $v.dateOfBirth.required.$invalid") This field is required.
      .form-group(:class="getValidationClass($v, 'gender')")
        label(for="gender") Gender
        .date-dropdowns
          .gender(@click="isDropdownOpenGender = !isDropdownOpenGender")
            .dropdown-toggle.gender(
              :class="[{ active: isDropdownOpenGender }]"
            ) 
              p {{ selectedGenders || "gender" }}
            .gender
              ul.dropdown-list.gender(
                :class="[{ active: isDropdownOpenGender }]"
              )
                li(
                  v-for="gender in gendersOptions",
                  :key="gender",
                  @click="selectGender(gender)"
                ) {{ gender }}
              span(v-if="$v.gender.$dirty && $v.gender.required.$invalid") This field is required.
      .form-group(:class="getValidationClass($v, 'country')")
        label(for="country") Country
        input(
          v-model="form.country",
          type="text",
          @blur="$v.country.$touch()",
          autocomplete="off",
          :placeholder="form.country ? '' : 'Type your country'",
          :class="{ 'filled-input': form.country }"
        )
        span(v-if="$v.country.$dirty && $v.country.required.$invalid") This field is required.
        span(v-else-if="$v.country.$dirty && $v.country.minLength.$invalid") Please enter a valid country.
      .form-group(:class="getValidationClass($v, 'city')")
        label(for="city") City
        input(
          v-model="form.city",
          type="text",
          @blur="$v.city.$touch()",
          :placeholder="form.city ? '' : 'Type your city'",
          autocomplete="off",
          :class="{ 'filled-input': form.city }"
        )
        span(v-if="$v.city.$dirty && $v.city.required.$invalid") This field is required.
        span(v-else-if="$v.city.$dirty && $v.city.minLength.$invalid") Please enter a valid city.
      .form-group(:class="getValidationClass($v, 'adress')")
        label(for="adress") Adress
        input(
          v-model="form.adress",
          type="text",
          @blur="$v.adress.$touch()",
          autocomplete="off",
          :placeholder="form.adress ? '' : 'Type your adress'",
          :class="{ 'filled-input': form.adress }"
        )

        span(v-if="$v.adress.$dirty && $v.adress.required.$invalid") This field is required.
        span(v-else-if="$v.adress.$dirty && $v.adress.minLength.$invalid") Please enter a valid adress.

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
import AppModal from "./AppModal.vue";
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
import CustomDropdown from "@/components/СustomDropdown.vue";
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
const monthsOptions = ref([
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]);

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
  return selectedYear.value || "";
});
const selectedDays = computed(() => {
  return selectedDay.value || "";
});
const selectedMonths = computed(() => {
  return selectedMonth.value || "";
});
const selectedGenders = computed(() => {
  return selectedGender.value || "";
});

const isDropdownOpenGender = ref(false);
const toggleDropdownGender = () => {
  isDropdownOpenGender.value = !isDropdownOpenGender.value;
};
const selectedDate = ref("");

const selectYear = (year) => {
  selectedYear.value = year;
  updateSelectedDate();
};

const selectDay = (day) => {
  selectedDay.value = day < 10 ? `0${day}` : day;
  updateSelectedDate();
};

const selectMonth = (month) => {
  selectedMonth.value = month;
  updateSelectedDate();
};
const updateSelectedDate = () => {
  selectedDate.value = `${selectedYear.value || "year"}-${
    selectedMonth.value ? selectedMonth.value.value : "month"
  }-${selectedDay.value || "day"}`;
  form.value.dateOfBirth = selectedDate.value;
};
const selectGender = (gender) => {
  selectedGender.value = gender;
  form.value.gender = selectedGender.value;
  isDropdownOpenGender.value = false;
  toggleDropdownGender();
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
const save = () => {
  if (checkValidation($v.value)) {
    return;
  }
  isAuthenticated.value = true;
  const jwtToken = localStorage.getItem("isAuthenticated");
  const headers = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  userApi.showUsers(headers).then((res) => {
    users.value = res.data;
    if (form.value.name === "") {
      form.value.name = users.value.name;
    } else {
      form.value.name;
    }
    if (form.value.surname === "") {
      form.value.surname = users.value.surname;
    } else {
      form.value.surname;
    }
    if (form.value.dateOfBirth === "") {
      form.value.dateOfBirth = users.value.dateOfBirth;
    } else {
      form.value.dateOfBirth = selectedDate.value.toString();
    }
    console.log("date", form.value.dateOfBirth);
    if (form.value.gender === "") {
      form.value.gender = users.value.gender;
    } else {
      form.value.gender;
    }
    console.log("form", toRaw(form.value));
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
      .updateUser(users.value.id, data)
      .then((res) => {
        console.log("res", res);
      })
      .catch((error) => {
        console.log(error);
      });
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
