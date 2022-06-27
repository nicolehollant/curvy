<template>
  <div class="relative grid grid-cols-[minmax(0,1fr),auto] bg-gray-100">
    <div class="w-full grid" id="sketch"></div>
    <div class="absolute top-0 right-0 p-2 grid gap-2">
      <button
        @click="modalUp = true"
        class="w-full flex justify-between items-center gap-2 p-1 bg-white/30 backdrop-filter backdrop-blur border border-gray-300 shadow-md z-10 rounded-md"
      >
        <span class="text-xs font-semibold hidden sm:block tracking-wide uppercase">options</span>
        <FAIcon icon="wrench" class="h-4" />
      </button>
      <button
        class="w-full flex justify-between items-center gap-2 p-1 bg-white/30 backdrop-filter backdrop-blur border border-gray-300 shadow-md z-10 rounded-md"
        @click="generateRandomPoints"
      >
        <span class="text-xs font-semibold hidden sm:block tracking-wide uppercase">randomize</span>
        <FAIcon icon="shuffle" class="h-4" />
      </button>
    </div>
    <UIModal title="options" v-model:open="modalUp">
      <section class="w-max px-4 py-4 shrink-0">
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
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import type { Spline, SplineMetadata } from '@curvy/types'
import p5 from 'p5'
import sketch from '@/assets/sketch'
import { onMounted, ref, watch } from 'vue'
import UIModal from './UIModal.vue'

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

const modalUp = ref(false)
const numSamples = ref(500)
const doMapToCanvas = ref(true)
const doSpaceEvenly = ref(true)

const generateRandomPoints = () => {
  const numPoints = 3 * (Math.floor(Math.random() * 5) + 2) + 1
  emit(
    'update:updatePoints',
    Array.from({ length: numPoints }).map((_, i) => [
      i * numPoints + Math.floor(Math.random() * numPoints),
      Math.floor(Math.random() * 500),
    ])
  )
}

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
