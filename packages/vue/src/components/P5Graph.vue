<template>
  <div class="flex bg-gray-100">
    <div class="w-full" id="sketch"></div>
    <section class="w-max px-4 py-4">
      <h3 class="text-lg font-medium">Options</h3>
      <label>
        <p># Samples:</p>
        <input
          type="number"
          class="px-2 py-1 bg-transparent appearance-none border border-gray-400 rounded focus-visible:ring ring-accent-mid focus:outline-none"
          v-model="numSamples"
        />
      </label>
      <label>
        <p>Use Spline Bounds</p>
        <input
          type="checkbox"
          class="px-2 py-1 bg-transparent border border-gray-400 rounded focus-visible:ring ring-accent-mid focus:outline-none"
          v-model="doMapToCanvas"
        />
      </label>
      <label>
        <p>Even Axes</p>
        <input
          type="checkbox"
          class="px-2 py-1 bg-transparent border border-gray-400 rounded focus-visible:ring ring-accent-mid focus:outline-none"
          v-model="doSpaceEvenly"
        />
      </label>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Spline, SplineMetadata } from '@curvy/types'
import p5 from 'p5'
import sketch from '@/assets/sketch'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  path?: string
  spline: Spline
  points: number[][]
  bounds?: SplineMetadata['bounds']
}>()

const emit = defineEmits<{
  (event: 'update:mouseIsOver', newValue: [number, boolean]): void
  (event: 'update:updatePoints', newValue: number[][]): void
}>()

const numSamples = ref(500)
const doMapToCanvas = ref(true)
const doSpaceEvenly = ref(true)

watch([numSamples, doMapToCanvas, doSpaceEvenly], () => {
  reset()
})
watch(
  () => props.points,
  () => {
    reset()
  },
  { deep: true }
)

const reset = () => {
  const event = new CustomEvent('resetsketch', {
    detail: {
      spline: props.spline,
      points: props.points.map(([x, y]) => ({ x, y })),
      numSamples: isNaN(Number(numSamples.value)) ? 500 : Number(numSamples.value),
      doMapToCanvas: doMapToCanvas.value,
      doSpaceEvenly: doSpaceEvenly.value,
    },
  })
  window.dispatchEvent(event)
}

onMounted(() => {
  new p5(
    sketch({
      spline: props.spline,
      points: props.points.map(([x, y]) => ({ x, y })),
      numSamples: isNaN(Number(numSamples.value)) ? 500 : Number(numSamples.value),
      doMapToCanvas: doMapToCanvas.value,
      doSpaceEvenly: doSpaceEvenly.value,
      emit,
    }),
    document.getElementById('sketch')!
  )
})
</script>
