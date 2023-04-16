<template>
    <div class="config">
        <div class="config-item">
            <span>仅显示选中对象</span>
            <n-switch v-model:value="visualConfig.showSelectedObjectOnly"></n-switch>
        </div>
        <div class="config-item">
            <span>显示对象详情</span>
            <n-switch v-model:value="visualConfig.showObjectDetail"></n-switch>
        </div>
        <div class="config-item">
            <span>是否显示地平面</span>
            <n-switch v-model:value="visualConfig.showGround"></n-switch>
        </div>
    </div>
</template>

<script setup lang="ts">
import {NSwitch} from 'naive-ui'
import {visualConfig} from "@/store/global";
</script>

<style scoped>
.config {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 10px;
}

.config-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
</style>
