import {computed, reactive, ref} from "vue";
import {labels} from "@/config/labels";
import {Annotation, Frame} from "@/cores/Annotations";
import {currentFrame} from "@/store/global";

export const currentLabelIndex = ref(0);

export const currentLabel = computed(() => {
  return labels[currentLabelIndex.value];
});

export const annotationObjects = reactive<Annotation[]>([]);

export const annotationObjectsAtCurrentFrame = computed(
  () => {
    const res: Frame[] = [];
    annotationObjects.forEach(annotation => {
      const annotationAtCurrentFrame = annotation.getFrame(currentFrame.value);
      if (annotationAtCurrentFrame !== null) {
        res.push(annotationAtCurrentFrame);
      }
    });
    return res;
  }
);

