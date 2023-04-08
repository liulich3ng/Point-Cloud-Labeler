import {computed, ref, shallowReactive} from "vue";
import {MODE, Panels} from "@/types/global";
import {Points} from "three";

export const items = {
  urls: ['./data/1.pcd', './data/2.pcd', './data/3.pcd', './data/4.pcd', './data/5.pcd', './data/6.pcd', './data/7.pcd']
};

export const PointsRecord: Points[] = shallowReactive([]);

export const currentFrame = ref(1);

export const mode = ref<MODE>(MODE.default);

export const activityPanelName = ref<string | null>(Panels.OBJECTS);

export const POINTS = computed(() => {
  return PointsRecord[currentFrame.value - 1];
});

export const FramesCount = computed(() => {
  return PointsRecord.length;
});
