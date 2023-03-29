<template>
  <div class="activity-bar">
    <ghost-icon placement="right" tooltip="Object List">
      <bookmarks-outline/>
    </ghost-icon>
  </div>
</template>

<script setup lang="ts">
import {
  BookmarksOutline
} from '@vicons/ionicons5'
import GhostIcon from "@/components/GhostIcon.vue";
</script>

<style scoped>
.activity-bar {
  box-sizing: border-box;
  height: 100%;
  width: var(--side-bar-width);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid var(--border-color);
  padding: 10px 0;
}
</style>
