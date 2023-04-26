<template>
  <div class="center detail">
    <div class="center">
      <cube-outline v-if="objectState.label.type==='cuboid'" class="colored icon"></cube-outline>
      <span> #{{ objectState.id }} </span>
    </div>
    <span> {{ objectState.label.name }} </span>
    <div class="center" style="gap: 5px">
      <div id="hidden-btn" class="icon center">
        <eye-off-outline v-if="objectState.hidden"></eye-off-outline>
        <eye-outline v-else></eye-outline>
      </div>
      <div id="lock-btn" class="icon center">
        <lock-closed-outline v-if="objectState.locked"></lock-closed-outline>
        <lock-open-outline v-else></lock-open-outline>
      </div>
      <remove-circle-outline id="remove-btn" class="icon"></remove-circle-outline>
      <trash-outline id="delete-btn" class="icon"></trash-outline>
    </div>
  </div>
</template>

<script setup lang="ts">
// https://github.com/vuejs/core/issues/4294
// import {ObjectState} from "@/cores/annotations";
import {Label} from "@/cores/Labels";
import {
  CubeOutline,
  EyeOutline,
  EyeOffOutline,
  LockOpenOutline,
  LockClosedOutline,
  RemoveCircleOutline,
  TrashOutline
} from '@vicons/ionicons5';

interface ObjectState {
  id: number,
  label: Label,
  locked: boolean,
  hidden: boolean,
  points: number[]
}

const objectState = defineProps<ObjectState>();
</script>

<style scoped>
.detail {
  justify-content: space-between;
  margin: 0 10px 10px;
  padding: 5px;
  border-radius: 3px;
  border: 1px solid v-bind('objectState.label.color+80');
  background-color: v-bind('objectState.label.color+60');
  user-select: none;
  height: 32px;
}

.icon {
  font-size: 20px;
  height: 1em;
  width: 1em;
}

.colored {
  color: v-bind('objectState.label.color');
}

.center {
  display: flex;
  align-items: center;
}
</style>
