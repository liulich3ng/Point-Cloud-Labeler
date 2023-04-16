<template>
    <n-space vertical class="activity-bar">
        <ghost-icon placement="right" :tooltip="Panels.OBJECTS"
                    :pressed="activityPanelName===Panels.OBJECTS"
                    @click="toggleActivityPanel(Panels.OBJECTS)">
            <list/>
        </ghost-icon>
        <ghost-icon placement="right" :tooltip="Panels.LABELS"
                    :pressed="activityPanelName===Panels.LABELS"
                    @click="toggleActivityPanel(Panels.LABELS)">
            <bookmarks-outline/>
        </ghost-icon>
        <ghost-icon placement="right" :tooltip="Panels.CONFIG"
                    :pressed="activityPanelName===Panels.CONFIG"
                    @click="toggleActivityPanel(Panels.CONFIG)">
            <options/>
        </ghost-icon>
    </n-space>
</template>

<script setup lang="ts">
//todo: using v-for?
import {
  List,
  BookmarksOutline,
  Options,
} from '@vicons/ionicons5'
import GhostIcon from "@/components/GhostIcon.vue";
import {NSpace} from 'naive-ui'
import {activityPanelName} from "@/store/global";
import {Panels} from "@/types/global";
import {render} from "@/functions/useRender";
import {nextTick} from "vue";


function toggleActivityPanel(panelName: string) {
  if (panelName === activityPanelName.value) {
    activityPanelName.value = null;
  } else {
    activityPanelName.value = panelName;
  }
  nextTick(render);
}
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
