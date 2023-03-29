<template>
  <div class="header">
    <n-space>
      <ghost-icon tooltip="menu">
        <reorder-four/>
      </ghost-icon>
      <ghost-icon tooltip="default" :pressed="mode===MODE.default"
                  @click="mode=MODE.default">
        <navigate-outline/>
      </ghost-icon>
      <ghost-icon tooltip="add" :pressed="mode===MODE.put"
                  @click="mode=MODE.put"
      >
        <add/>
      </ghost-icon>
      <label-select style="width: 100px"></label-select>
      <n-divider vertical></n-divider>
      <ghost-icon tooltip="reset camera">
        <camera-reverse-outline/>
      </ghost-icon>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {
  ReorderFour,
  NavigateOutline,
  Add,
  CameraReverseOutline
} from '@vicons/ionicons5'
import {NSpace, NDivider} from 'naive-ui'
import GhostIcon from "@/components/GhostIcon.vue";
import {mode} from "@/store/item";
import {MODE} from "@/types/draw";
import LabelSelect from "@/components/LabelSelect.vue";
</script>

<style scoped>
.header {
  flex: 0 0 var(--header-height);
  border-bottom: 1px solid var(--border-color);
  padding-left: 40px;
  display: flex;
  align-items: center;
}
</style>
