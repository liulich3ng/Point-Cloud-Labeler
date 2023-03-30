<template>
  <div class="footer">
    <ghost-icon tooltip="first frame" placement="top" @click="currentFrame=1">
      <play-skip-back></play-skip-back>
    </ghost-icon>
    <ghost-icon tooltip="previous frame" placement="top"
                @click="currentFrame=Math.max(currentFrame-1,1)">
      <play-back></play-back>
    </ghost-icon>
    <ghost-icon tooltip="play" placement="top">
      <play></play>
    </ghost-icon>
    <ghost-icon tooltip="next frame" placement="top"
                @click="currentFrame=Math.min(currentFrame+1, pcdDataCache.length)">
      <play-forward></play-forward>
    </ghost-icon>
    <ghost-icon tooltip="last frame" placement="top"
                @click="currentFrame=pcdDataCache.length">
      <play-skip-forward></play-skip-forward>
    </ghost-icon>
    <n-divider vertical></n-divider>
    <div class="frame-index" :class="{current:currentFrame===index}"
         v-for="index in pcdDataCache.length" @click="currentFrame=index">
      {{ index }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlaySkipBack,
  PlaySkipForward,
  PlayForward,
  PlayBack,
  Play,
} from '@vicons/ionicons5'
import {NDivider} from 'naive-ui'
import GhostIcon from "@/components/GhostIcon.vue";
import {currentFrame, pcdDataCache} from "@/store/global";
</script>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  padding: 0 10px;
  flex: 0 0 var(--footer-height);
  border-top: 1px solid var(--border-color);
}

.current {
  background-color: var(--primary-color) !important;
}

.frame-index {
  text-align: center;
  user-select: none;
  line-height: 32px;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  margin-left: 10px;
  background-color: rgba(255, 255, 255, 0.12);
}

.frame-index:hover {
  background-color: rgba(255, 255, 255, 0.32);
}
</style>
