import {reactive, ref} from "vue";
import {PCDData} from "@/types/pcd";
import {MODE, Panels} from "@/types/global";

export const items = {
  urls: ['./1.pcd', './2.pcd', './3.pcd', './4.pcd', './5.pcd', './6.pcd']
}

export const pcdDataCache: PCDData[] = reactive([]);

export const currentFrame = ref(1);

export const mode = ref<MODE>(MODE.default);

export const mousePosition = {
  x: 0,
  y: 0
}

export const activityPanelName = ref<string | null>(Panels.OBJECTS);
