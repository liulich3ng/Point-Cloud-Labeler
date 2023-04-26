import {computed, reactive, ref, shallowReactive} from "vue";
import {MODE} from "@/types/global";
import {Points} from "three";

export const items = {
  urls: ['./data/1.pcd', './data/2.pcd', './data/3.pcd', './data/4.pcd', './data/5.pcd', './data/6.pcd', './data/7.pcd']
};

export const pointClouds: Points[] = shallowReactive([]);

export const currentFrame = ref(1);

export const pointCloud = computed(() => {
  return pointClouds[currentFrame.value - 1];
});

export const totalFrames = computed(() => {
  return pointClouds.length;
});

export const groundHeight = ref(0);

export const seedArea = 0.4;

export const visualConfig = reactive({
  showSelectedObjectOnly: false,
  showObjectDetail: false,
  showGround: false,
});

export const mode = ref<MODE>(MODE.default);
