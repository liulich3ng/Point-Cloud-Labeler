<template>
  <n-config-provider :theme="darkTheme" :locale="zhCN" :date-locale="dateZhCN">
    <div class="container">
      <app-header/>
      <div class="main">
        <app-side-bar/>
        <app-editor/>
      </div>
      <app-status-bar/>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import {darkTheme, NConfigProvider, zhCN, dateZhCN} from 'naive-ui'
import AppHeader from "@/components/AppHeader.vue"
import AppSideBar from "@/components/AppSideBar.vue"
import AppEditor from "@/components/AppEditor.vue"
import AppStatusBar from "@/components/AppFooter.vue"
import {loadPCD} from "@/functions/usePointCloud";

loadPCD()
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main {
  flex: auto;
  display: flex;
}
</style>
