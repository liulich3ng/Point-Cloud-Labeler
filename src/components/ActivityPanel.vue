<template>
    <div class="activity-panel" v-show="activityPanelName!=null">
        <object-list v-show="activityPanelName===Panels.OBJECTS"></object-list>
        <label-list v-show="activityPanelName===Panels.LABELS"></label-list>
        <visual-config v-show="activityPanelName===Panels.CONFIG"></visual-config>
    </div>
</template>

<script setup lang="ts">
import {activityPanelName} from "@/store/global";
import {Panels} from "@/types/global";
import ObjectList from "@/components/ObjectList.vue";
import LabelList from "@/components/LabelList.vue";
import VisualConfig from "@/components/VisualConfig.vue";
</script>

<style scoped>
.activity-panel {
    display: flex;
    height: 100%;
    width: var(--side-panel-width);
    border-right: 1px solid var(--border-color);
}
</style>
