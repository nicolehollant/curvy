<script setup lang="ts">
import { createCubicBezierSpline } from '@curvy/bezier'
import { toPath } from '@curvy/visualize'
import { ref, computed, watch } from 'vue'
import Graph from '../components/Graph.vue'
import SplineEditor from '../components/SplineEditor.vue'
import P5Graph from '../components/P5Graph.vue'

const points = ref([
  [0, 0],
  [40, 50],
  [60, 34],
  [80, 93],
])

const generateRandomPoints = () => {
  const numPoints = 3 * (Math.floor(Math.random() * 5) + 2) + 1
  points.value = Array.from({ length: numPoints }).map((_, i) => [
    i * numPoints + Math.floor(Math.random() * numPoints),
    Math.floor(Math.random() * 500),
  ])
}

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

<template>
  <span class="shadow-md z-20">
    <header
      class="bg-brand-mid py-2 px-4 w-full shadow-lg flex gap-2 justify-between sm:grid sm:grid-cols-[1fr,1fr,1fr] items-center"
    >
      <a
        href="https://www.npmjs.com/package/@curvy/bezier"
        target="_blank"
        rel="noopener noreferrer"
        class="text-left w-max text-accent-dark flex items-center"
      >
        <FAIcon :icon="['fab', 'npm']" class="h-8" />
      </a>
      <h1 class="text-xl font-medium text-center text-brand-dark">Curvy Spline Editor</h1>
      <button
        class="w-max sm:ml-auto text-accent-dark flex items-center gap-2"
        @click="generateRandomPoints"
      >
        <p class="text-sm font-semibold">SHUFFLE</p>
        <FAIcon icon="shuffle" class="h-3" />
      </button>
    </header>
  </span>
  <main
    class="grid grid-rows-[auto,1fr] lg:grid-rows-1 lg:grid-cols-[300px,1fr] h-full place-items-center overflow-hidden"
  >
    <span class="w-full shadow-md h-full overflow-hidden bg-white z-10">
      <div class="w-full bg-brand-mid/20 shadow-xl h-full overflow-auto px-1 py-3">
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
