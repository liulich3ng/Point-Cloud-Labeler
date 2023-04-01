import {reactive, ref} from "vue";
import {PCDData} from "@/types/pcd";
import {MODE, Panels} from "@/types/global";

export const items = {
  urls: ['./data/1.pcd', './data/2.pcd', './data/3.pcd', './data/4.pcd', './data/5.pcd', './data/6.pcd', './data/7.pcd']
}

export const pcdDataCache: PCDData[] = reactive([]);

export const currentFrame = ref(1);

export const mode = ref<MODE>(MODE.default);

export const mousePosition = {
  x: 0,
  y: 0
}

export const activityPanelName = ref<string | null>(Panels.OBJECTS);
