<template>
  <!-- lines -->
  <div
    v-if="mouseIsOver || lineTo"
    class="absolute border-t border-dashed border-gray-300"
    :style="{
      bottom: `${Math.round((modelValue[1] * 100) / bounds.y.max)}%`,
      width: `${Math.round((modelValue[0] * 100) / bounds.x.max)}%`,
    }"
  />
  <div
    v-if="mouseIsOver || lineTo"
    class="absolute bottom-0 border-l border-dashed border-gray-300"
    :style="{
      left: `${Math.round((modelValue[0] * 100) / bounds.x.max)}%`,
      height: `${Math.round((modelValue[1] * 100) / bounds.y.max)}%`,
    }"
  />
  <!-- labels -->
  <div
    v-if="mouseIsOver || lineLabels"
    class="bg-white p-2 rounded-md shadow z-10 absolute top-[calc(100%+0.5rem)] transform -translate-x-1/2"
    :style="{
      left: `${Math.round((modelValue[0] * 100) / bounds.x.max)}%`,
    }"
  >
    {{ modelValue[0] }}
  </div>
  <div
    v-if="mouseIsOver || lineLabels"
    class="bg-white p-2 rounded-md shadow z-10 absolute right-[calc(100%+0.5rem)] transform translate-y-1/2"
    :style="{
      bottom: `${Math.round((modelValue[1] * 100) / bounds.y.max)}%`,
    }"
  >
    {{ modelValue[1] }}
  </div>
  <!-- point -->
  <div
    @mouseenter="() => (mouseIsOver = true)"
    @mouseleave="() => (mouseIsOver = false)"
    class="absolute w-3 h-3 rounded-full grid place-items-center transform -translate-x-1/2 translate-y-1/2"
    :style="{
      bottom: `${Math.round((modelValue[1] * 100) / bounds.y.max)}%`,
      left: `${Math.round((modelValue[0] * 100) / bounds.x.max)}%`,
    }"
  >
    <div class="bg-accent-mid w-1.5 h-1.5 rounded-full"></div>
  </div>
</template>

<script setup lang="ts">
import type { SplineMetadata } from '@curvy/types'
import { ref, watch, type PropType } from 'vue'
const props = defineProps({
  modelValue: {
    type: Object as PropType<number[]>,
    required: true,
  },
  bounds: {
    type: Object as PropType<SplineMetadata['bounds']>,
    required: true,
  },
  lineTo: {
    type: Boolean,
    default: false,
  },
  lineLabels: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', newValue: number[]): void
  (event: 'update:mouseIsOver', newValue: boolean): void
}>()

const mouseIsOver = ref(false)

watch(mouseIsOver, () => {
  emit('update:mouseIsOver', mouseIsOver.value)
})

const update = (e: any, x: number, y: number) => {
  const newVal = [...props.modelValue]
  newVal[0] = x
  newVal[1] = y
  emit('update:modelValue', newVal)
}
</script>
