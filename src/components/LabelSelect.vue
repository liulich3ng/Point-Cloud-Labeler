<template>
  <n-select v-model:value="currentLabelIndex"
            :options="options"></n-select>
</template>

<script setup lang="ts">
import {currentLabelIndex} from '@/store/annotations.js';
import {labels} from "@/config/labels";
import {NSelect} from 'naive-ui'

const options = labels.map((label, index) => {
  return {
    label: label.name,
    value: index,
  }
})
</script>

<style scoped>

</style>
