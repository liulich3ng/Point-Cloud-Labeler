<template>
    <div>
        <div v-for="obj in annotationObjectsAtCurrentFrame">
            {{ obj.id }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {
  annotationObjectsAtCurrentFrame
} from "@/store/annotations";

</script>

<style scoped>

</style>
