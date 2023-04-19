import {computed, reactive, ref} from "vue";
import {labels} from "@/config/labels";
import {Annotation, ObjectState} from "@/cores/annotations";
import {currentFrame} from "@/store/global";


export const currentLabelIndex = ref(0);

export const currentLabel = computed(() => {
  return labels[currentLabelIndex.value];
});

export const annotationObjects = reactive<Annotation[]>([]);

export const annotationObjectsAtCurrentFrame = computed(
  () => {
    const res: ObjectState[] = [];
    annotationObjects.forEach(annotation => {
      const annotationAtCurrentFrame = annotation.atFrame(currentFrame.value);
      if (annotationAtCurrentFrame !== null) {
        res.push(annotationAtCurrentFrame);
      }
    });
    return res;
  }
);
