<template>
  <div class="grid gap-1">
    <div
      class="flex items-center gap-4 p-1"
      :class="{
        'bg-error-light': i + 1 > numValidPoints,
        'bg-accent-light': mouseIsOver[i],
      }"
      v-for="(point, i) in modelValue"
      :key="i"
    >
      <div class="flex items-center gap-1">
        <p>{{ i + 1 }}</p>
        <div
          class="border bg-white px-2 py-1 border-gray-400 rounded focus-within:ring ring-accent-mid flex"
        >
          <span>(</span>
          <input
            :style="{ width: Math.max(1, point[0].toString().length) + 'ch' }"
            type="text"
            :disabled="i + 1 > numValidPoints"
            class="bg-transparent appearance-none min-w-[1ch] focus:outline-none"
            :value="point[0]"
            @input="(e: any) => update(e, i, 0)"
            @keydown="
              (e) => {
                if (e.key === ',') {
                  e.preventDefault()
                  e.stopPropagation()
                  simulateTab(e)
                }
              }
            "
          />
          <span>,</span>
          <input
            :style="{ width: Math.max(1, point[1].toString().length) + 'ch' }"
            type="text"
            :disabled="i + 1 > numValidPoints"
            class="ml-1 bg-transparent appearance-none min-w-[1ch] focus:outline-none"
            :value="point[1]"
            @input="(e: any) => update(e, i, 1)"
          />
          <span>)</span>
        </div>
      </div>
      <!-- <div class="flex items-center gap-1">
        <p>X:</p>
        <input
          type="number"
          :disabled="i + 1 > numValidPoints"
          class="bg-transparent appearance-none border border-gray-400 rounded focus-visible:ring ring-accent-mid"
          :value="point[0]"
          @input="(e) => update(e, i, 0)"
        />
      </div>
      <div class="flex items-center gap-1">
        <p>Y:</p>
        <input
          type="number"
          :disabled="i + 1 > numValidPoints"
          class="bg-transparent appearance-none border border-gray-400 rounded focus-visible:ring ring-accent-mid"
          :value="point[1]"
          @input="(e) => update(e, i, 1)"
        />
      </div> -->
      <button @click="() => removePoint(i)">
        <FAIcon icon="x" class="h-3" />
      </button>
    </div>
    <button @click="addPoint" class="w-full">+</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  modelValue: number[][]
  mouseIsOver: boolean[]
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', newValue: number[][]): void
}>()

const allowedKeys = '1234567890-.'.split('')
const numValidPoints = computed(() => {
  let len = props.modelValue.length
  const r = (len - 1) % 3
  len -= r
  return len
})

const addPoint = () => {
  emit('update:modelValue', [...props.modelValue, [0, 0]])
}

const simulateTab = (e: any) => {
  const el = [...e.target.parentElement.querySelectorAll('input')][1]
  el.focus()
  el.select()
}

const removePoint = (i: number) => {
  const newVal = [...props.modelValue]
  newVal.splice(i, 1)
  emit('update:modelValue', newVal)
}

const update = (e: InputEvent, i: number, j: number) => {
  if (!e.data) {
    return
  }
  if (!allowedKeys.includes(e.data)) {
    emit('update:modelValue', [...props.modelValue])
    return
  }
  const newVal = [...props.modelValue]
  newVal[i][j] = Number((e.target as any).value)
  emit('update:modelValue', newVal)
}
</script>
