<template lang="pug">
.date-dropdowns
  div(:class="propsClass", @click="isDropdownOpen = !isDropdownOpen") 
    .dropdown-toggle(:class="[{ active: isDropdownOpen }, propsClass]")
      p {{ selectedDays || value }}
    div 
      ul.dropdown-list(:class="[{ active: isDropdownOpen }, propsClass]")
        li(v-for="item in items", :key="item", @click="selectDay(item)") {{ item }}
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  items: Array,
  value: String,
  propsClass: String,
});
const emit = defineEmits(["select", "isAuth"]);
const isDropdownOpen = ref(false);
const daysOptions = Array.from({ length: 31 }, (_, index) => index + 1);
const selectedDay = ref("");
const selectedDate = ref("");
const selectedDays = computed(() => {
  return selectedDay.value || "";
});
const selectDay = (day) => {
  //   selectedDay.value = day < 10 ? `0${day}` : day;
  emit("select", day);
  //   updateSelectedDate();
};
</script>

<style lang="scss">
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
</style>
