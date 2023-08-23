<template lang="pug">
div
  .tab-buttons
    button(@click="showTab(0)", :class="{ active: activeTab === 0 }")
      | Favourite
    button(@click="showTab(1)", :class="{ active: activeTab === 1 }")
      | Details
    button(@click="showTab(2)", :class="{ active: activeTab === 2 }")
      | Comments
  .tab-content
    div(v-show="activeTab === 0") Content for Tab 1
    div(v-show="activeTab === 1") 
      details-component(:file="file") 
    div(v-show="activeTab === 2") Content for Tab 3
</template>

<script setup lang="ts">
import { ref } from "vue";
import DetailsComponent from "@/components/DetailsComponent.vue";
const activeTab = ref(0);

const showTab = (tabIndex: number) => {
  activeTab.value = tabIndex;
};

const props = defineProps({
  file: String,
});
</script>

<style lang="scss">
.tab-buttons {
  display: flex;
  height: 44px;
  margin: 50px 0 38px;
  button {
    color: var(--secondary-bt-1);
    font-family: var(--font-inter);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    border: none;
    background: transparent;
    padding: 14px 16px;
    &.active {
      border-bottom: 1px solid var(--default-c-1);
      color: var(--default-c-1);
    }
  }
}
</style>
