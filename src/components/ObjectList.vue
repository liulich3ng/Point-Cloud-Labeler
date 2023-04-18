<template>
  <div style="display: flex;flex-direction: column">
    <div class="title">
      <div>{{ annotationObjectsAtCurrentFrame.length }} / {{ annotationObjects.length }}</div>
      <div style="display: flex;align-items: center;gap: 10px;">
        <n-icon :size="20">
          <alert-circle-outline></alert-circle-outline>
        </n-icon>
        <n-icon :size="20">
          <eye-outline></eye-outline>
        </n-icon>
        <n-icon :size="20">
          <close-circle-outline></close-circle-outline>
        </n-icon>
      </div>
    </div>

    <n-scrollbar style="max-height: calc(100vh - var(--header-height)*2 - var(--footer-height))">
      <object-detail v-for="objectState in annotationObjectsAtCurrentFrame" v-bind="objectState"></object-detail>
    </n-scrollbar>

  </div>
</template>

<script setup lang="ts">
import {
  annotationObjects,
  annotationObjectsAtCurrentFrame
} from "@/store/annotations";
import ObjectDetail from "@/components/ObjectDetail.vue";
import {NScrollbar, NIcon} from 'naive-ui'
import {AlertCircleOutline, EyeOutline, EyeOffOutline, CloseCircleOutline} from '@vicons/ionicons5'
import {visualConfig} from "@/store/global";
</script>

<style scoped>
.title {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
  height: var(--header-height);
}
</style>
