<template>
  <div class="p-8 m-8 relative w-max">
    <div class="w-max relative">
      <svg
        height="400"
        class="border-l border-b border-dashed border-gray-200"
        :viewBox="[bounds.x.min, bounds.y.min, bounds.x.max, bounds.y.max].join(' ')"
      >
        <path stroke-width="1" stroke="black" fill="none" :d="path" />
      </svg>
      <SplinePoint
        @update:mouse-is-over="(val) => $emit('update:mouseIsOver', [index, val])"
        :bounds="bounds"
        v-for="(point, index) in points"
        :model-value="point"
        :key="index"
      />
    </div>
    <p class="bg-white absolute top-0 left-0">
      ({{ [Math.floor(bounds.x.min), Math.ceil(bounds.y.max)].join(', ') }})
    </p>
    <p class="bg-white absolute bottom-0 left-0">
      ({{ [Math.floor(bounds.x.min), Math.ceil(bounds.y.min)].join(', ') }})
    </p>
    <p class="bg-white absolute bottom-0 right-0">
      ({{ [Math.floor(bounds.x.max), Math.ceil(bounds.y.min)].join(', ') }})
    </p>
  </div>
</template>

<script setup lang="ts">
import type { SplineMetadata } from '@curvy/types'
import SplinePoint from './SplinePoint.vue'

defineProps<{
  path: string
  points: number[][]
  bounds: SplineMetadata['bounds']
}>()

defineEmits<{
  (event: 'update:mouseIsOver', newValue: [number, boolean]): void
}>()
</script>
