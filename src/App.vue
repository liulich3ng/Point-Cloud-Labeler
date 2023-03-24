<template>
  <div class="container">
    <app-header class="header"></app-header>
    <div class="main">
      <div class="sidebar"></div>
      <div class="editor"></div>
    </div>
    <div class="statusbar">
      <p>Line 1, Column 1</p>
      <p>UTF-8</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue"
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e1e;
  color: #fff;
  padding: 0 20px;
  height: 50px;
}

.main {
  flex: 1;
  display: flex;
}

.sidebar {
  display: flex;
  flex-direction: column;
  background-color: #252526;
  color: #fff;
  padding: 20px;
  width: 200px;
}

.editor {
  flex: 1;
  background-color: #1e1e1e;
  color: #fff;
  padding: 20px;
}

.statusbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007acc;
  color: #fff;
  padding: 0 20px;
  height: 20px;
}
</style>
