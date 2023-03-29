<template>
  <div>
    <n-tooltip trigger="hover" :show-arrow="false" :placement="placement">
      <template #trigger>
        <div class="ghost square" :class="{pressed:pressed}">
          <n-icon size="18">
            <slot></slot>
          </n-icon>
        </div>
      </template>
      {{ tooltip }}
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import {NIcon, NTooltip} from 'naive-ui'

withDefaults(defineProps<{
  size?: number
  placement?: string
  pressed?: boolean
  tooltip: string
}>(), {
  size: 32,
  placement: 'top'
})

</script>

<style scoped>
.ghost:hover {
  background-color: var(--hover-color);
}

.square {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind(size+ 'px');
  height: v-bind(size+ 'px');
  border-radius: v-bind(size/10 + 'px');;
}

.pressed {
  background-color: var(--primary-color) !important;
}
</style>
