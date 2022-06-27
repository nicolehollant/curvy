<template>
  <span class="shadow-md z-20">
    <CurvyHeader />
  </span>
  <main
    class="grid grid-rows-[minmax(500px,1fr),auto] lg:grid-rows-1 lg:grid-cols-[300px,1fr] h-full place-items-center overflow-hidden"
  >
    <span class="row-start-2 lg:row-start-1 w-full shadow-md h-full overflow-hidden bg-white z-10">
      <div class="w-full bg-brand-mid/20 shadow-xl h-full overflow-auto px-2 py-3">
        <SplineEditor v-model="points" :mouseIsOver="mouseIsOver" :key="updatedPoints" />
      </div>
    </span>
    <P5Graph
      class="w-full h-full"
      v-model:points="points"
      @update:updatePoints="updatePoints"
      :spline="spline"
      @update:mouse-is-over="([index, val]) => (mouseIsOver[index] = val)"
    />
  </main>
</template>

<script setup lang="ts">
import { createCubicBezierSpline } from '@curvy/bezier'
import { ref, computed, watch } from 'vue'
import SplineEditor from '../components/SplineEditor.vue'
import P5Graph from '../components/P5Graph.vue'
import CurvyHeader from '../components/CurvyHeader.vue'

const points = ref([
  [0, 0],
  [40, 50],
  [60, 34],
  [80, 93],
])

const mouseIsOver = ref(Array.from({ length: points.value.length }).fill(false) as boolean[])

watch(
  () => points.value.length,
  () => {
    mouseIsOver.value = Array.from({ length: points.value.length }).fill(false) as boolean[]
  }
)

const updatedPoints = ref(0)
watch(
  points,
  () => {
    updatedPoints.value++
  },
  { deep: true }
)
const updatePoints = (val: number[][]) => {
  points.value = val
  updatedPoints.value++
}

const toValidNumPoints = (arr: any[]) => {
  let len = arr.length
  const r = (len - 1) % 3
  len -= r
  return arr.slice(0, len)
}

const spline = computed(() =>
  createCubicBezierSpline(
    toValidNumPoints(
      points.value.map((a) => {
        const [x, y] = a
        return { x: Number(x), y: Number(y) }
      })
    )
  )
)
</script>

<style>
html,
body,
#app {
  height: 100%;
  max-height: 100vh;
}
#app {
  @apply grid grid-rows-[auto,1fr] overflow-hidden;
}
</style>
