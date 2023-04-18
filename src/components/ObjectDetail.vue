<template>
  <div class="detail">
    <div style="display:flex;align-items: center">
      <cube-outline v-if="objectState.label.type==='cuboid'" class="colored icon"></cube-outline>
      <span> #{{ objectState.id }} </span>
    </div>
    <span> {{ objectState.label.name }} </span>
    <div style="display:flex;align-items: center;gap: 5px">
      <eye-off-outline v-if="objectState.hidden" class="icon"></eye-off-outline>
      <eye-outline v-else class="icon"></eye-outline>
      <lock-closed-outline v-if="objectState.locked" class="icon"></lock-closed-outline>
      <lock-open-outline v-else class="icon"></lock-open-outline>
      <remove-circle-outline class="icon"></remove-circle-outline>
      <trash-outline class="icon"></trash-outline>
    </div>
  </div>
</template>

<script setup lang="ts">
// https://github.com/vuejs/core/issues/4294
// import {ObjectState} from "@/cores/annotations";
import {Label} from "@/cores/labels";
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px 10px;
  padding: 5px;
  border-radius: 3px;
  border: 1px solid v-bind('objectState.label.color+80');
  background-color: v-bind('objectState.label.color+60');
  user-select: none;
}

.icon {
  font-size: 20px;
  height: 1em;
  width: 1em;
}

.colored {
  color: v-bind('objectState.label.color');
}
</style>
