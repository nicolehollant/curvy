<template>
  <h3 class="text-xs font-semibold uppercase text-gray-500 tracking-wide">Points</h3>
  <div class="mt-1 grid gap-1 w-full">
    <PointEditor
      class="flex items-center gap-4"
      v-for="(point, i) in modelValue"
      :key="i"
      :model-value="point"
      :mouse-is-over="mouseIsOver[i]"
      @update:modelValue="(val) => update(i, val)"
      @remove="() => removePoint(i)"
      :isValidIndex="i + 1 <= numValidPoints"
      :can-remove="modelValue.length > 4"
    ></PointEditor>
  </div>
  <button
    @click="addPoint"
    class="mt-2 py-3 w-full flex items-center justify-center focus:outline-none focus:ring ring-accent-mid rounded bg-brand-mid text-white gap-2"
  >
    <span class="text-lg font-semibold uppercase">Add Points</span>
    <FAIcon icon="plus" class="h-4" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PointEditor from './PointEditor.vue'
const props = defineProps<{
  modelValue: number[][]
  mouseIsOver: boolean[]
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', newValue: number[][]): void
}>()

const numValidPoints = computed(() => {
  let len = props.modelValue.length
  const r = (len - 1) % 3
  len -= r
  return len
})

const addPoint = () => {
  const newPoints = Array.from({ length: 3 }).fill([0, 0]) as number[][]
  emit('update:modelValue', [...props.modelValue, ...newPoints])
}

const removePoint = (i: number) => {
  const newVal = [...props.modelValue]
  newVal.splice(i, 1)
  emit('update:modelValue', newVal)
}

const update = (i: number, val: number[]) => {
  const newVal = [...props.modelValue]
  newVal[i] = val
  emit('update:modelValue', newVal)
}
</script>
