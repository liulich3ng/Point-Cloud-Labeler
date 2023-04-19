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
      <object-detail v-for="objectState in annotationObjectsAtCurrentFrame" v-bind="objectState"
                     @click="handle($event, objectState.id)"></object-detail>
    </n-scrollbar>

  </div>
</template>

<script setup lang="ts">
import {
  annotationObjects,
  annotationObjectsAtCurrentFrame
} from "@/store/annotations";
import ObjectDetail from "@/components/ObjectDetail.vue";
import {NScrollbar, NIcon} from 'naive-ui';
import {AlertCircleOutline, EyeOutline, CloseCircleOutline} from '@vicons/ionicons5';
import {Annotation} from "@/cores/annotations";
import {currentFrame} from "@/store/global";


function handle(event: PointerEvent, objectId: number) {
  let iconButton = (event.target as HTMLElement).closest('.icon');
  if (!iconButton) return;
  const annotation = annotationObjects.find(a => {
    return a.id === objectId;
  }) as Annotation;
  switch (iconButton.id) {
    case 'hidden-btn':
      annotation.toggleVisibility();
      break;
    case 'lock-btn':
      annotation.toggleLock();
      break;
    case 'remove-btn':
      annotation.deleteFrame(currentFrame.value);
      break;
    case 'delete-btn':
      annotation.delete();
      break;
  }
}
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
