<template>
  <div class="sidebar">
    <activity-bar></activity-bar>
    <activity-panel></activity-panel>
  </div>
</template>

<script setup lang="ts">
import ActivityBar from "@/components/ActivityBar.vue";
import ActivityPanel from "@/components/ActivityPanel.vue";

</script>

<style scoped>
.sidebar {
  flex: 0 0 calc(var(--side-bar-width) + var(--side-panel-width));
  border-right: 1px solid var(--border-color);
}
</style>
