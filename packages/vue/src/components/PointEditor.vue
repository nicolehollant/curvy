<template>
  <label
    :class="{
      'bg-error-light': !isValidIndex,
      'bg-accent-light': mouseIsOver,
      'bg-white': isValidIndex && !mouseIsOver,
    }"
    class="flex items-center border-gray-400 focus-within:ring rounded-md ring-accent-mid z-10 relative"
  >
    <div class="relative px-2 py-2 w-full">
      <input
        type="text"
        :disabled="!isValidIndex"
        class="bg-transparent appearance-none min-w-[1ch] focus:outline-none text-xl"
        placeholder="x, y"
        :value="_value"
        @input="(e: any) => update(e)"
      />
      <p
        v-if="isValidPoint.hasContent"
        class="bg-transparent min-w-[1ch] text-xl absolute top-2 left-2"
      >
        <span
          class="whitespace-pre"
          :class="{
            'text-error-dark': !isValidPoint.hasComma || !isValidPoint.firstValid,
          }"
          >{{ _value.split(',')[0] }}</span
        >
        <span :class="{ 'text-gray-500': !isValidPoint.hasComma }">,</span>
        <span
          v-if="_value.split(',').length > 1"
          class="whitespace-pre"
          :class="{
            'text-error-dark': !isValidPoint.hasComma || !isValidPoint.secondValid,
          }"
          >{{ _value.split(',')[1] }}</span
        >
      </p>
    </div>
    <button
      v-if="canRemove"
      @click="removePoint"
      :class="{
        'border-gray-100': isValidIndex,
        'border-error-mid/20': !isValidIndex,
        'border-accent-mid/20': mouseIsOver,
      }"
      class="flex items-center border-l-2 h-full z-0 focus:outline-none focus:bg-error-light/50 px-3 rounded-r-md text-gray-500 hover:text-error-dark focus:text-error-dark"
    >
      <FAIcon icon="x" class="h-3" />
    </button>
  </label>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: number[]
  mouseIsOver: boolean
  isValidIndex: boolean
  canRemove: boolean
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', newValue: number[]): void
  (event: 'remove'): void
}>()

const allowedKeys = '1234567890-.'.split('')
const _value = ref([...props.modelValue].join(', '))

const removePoint = () => {
  emit('remove')
}

const isValidPoint = computed(() => ({
  hasContent: _value.value.trim().length > 0,
  hasComma: _value.value.includes(','),
  firstValid: !isNaN(Number(_value.value.split(',')?.[0])),
  secondValid: !isNaN(Number(_value.value.split(',')?.[1])),
}))

const update = (e: InputEvent) => {
  _value.value = (e.target as any).value
  const newVal = _value.value
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map((coordinate) => parseFloat(coordinate.trim()))
  if (newVal && newVal.length === 2 && newVal.every((a) => !isNaN(a))) {
    emit('update:modelValue', newVal)
  }
}
</script>
