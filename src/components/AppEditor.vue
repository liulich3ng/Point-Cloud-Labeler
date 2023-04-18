<template>
	<div id="editor">
		<div id="perspective"></div>
		<div class="three">
			<div id="top">top</div>
			<div id="main">main</div>
			<div id="left">left</div>
		</div>
		<canvas id="canvas"></canvas>
	</div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {initRenderer} from "@/functions/useRender";
import {initCamera} from "@/functions/useCamera";
import {initWatcher} from "@/functions/useWatcher";
import {initDefaultListeners} from "@/functions/useListenerDefault";
import {initDragListener} from "@/functions/useListenerDrag";
import {initPutListener} from "@/functions/useListenerPut";
import {initKeyboard} from "@/functions/useKeyboard";

onMounted(() => {
  initRenderer();
  initCamera();
  initWatcher();
  initDefaultListeners();
  initKeyboard();
  initDragListener();
  initPutListener();
});
</script>

<style scoped>
#editor {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
}

#perspective {
    flex: 1 1 auto;
    border-right: 1px solid var(--border-color);
}

.three {
    flex: 0 0 240px;
    display: flex;
    flex-direction: column;
}

#top, #main, #left {
    flex: 1;
}

#canvas {
    z-index: -1;
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
}
</style>
