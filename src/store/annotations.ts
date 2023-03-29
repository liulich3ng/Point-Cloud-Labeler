import {computed, reactive, ref} from "vue";
import {labels} from "@/config/labels";
import {Annotation} from "@/cores/annotations";


export const currentLabelIndex = ref(0);

export const currentLabel = computed(() => {
  return labels[currentLabelIndex.value];
})

export const annotationObjects = reactive<Annotation[]>([]);


