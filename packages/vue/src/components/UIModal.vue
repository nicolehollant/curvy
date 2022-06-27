<template>
  <div
    class="fixed w-screen h-screen overflow-auto inset-0 bg-opacity-25 bg-black backdrop-filter backdrop-blur-sm p-4 sm:p-[10vmin] flex justify-center z-30"
    v-if="open"
    @click.self="$emit('update:open', false)"
  >
    <div
      class="w-full h-max max-w-md bg-gray-100 rounded-xl px-4 pb-4 space-y-4 border-2 border-gray-300/50 shadow-xl"
    >
      <header
        class="flex justify-between items-center pt-4 pb-3 border-b-2 border-gray-200/50 text-gray-600 -mx-4 px-4"
      >
        <h2 class="text-xl sm:text-4xl text-gray-600 font-bold tracking-wider text-left uppercase">
          {{ title }}
        </h2>
        <button @click="$emit('update:open', false)">
          <FAIcon icon="times" class="h-6 w-6 text-error-mid" />
        </button>
      </header>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
}>()
defineEmits<{
  (event: 'update:open', newValue: boolean): void
}>()
</script>
