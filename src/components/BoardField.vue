<template>
  <button :disabled="field.revealed || result.length > 0" @click="$emit('reveal')" @contextmenu="mark"
          class="w-8 h-8 flex cursor-pointer shadowy focus:outline-none flex justify-center items-center font-bold flex-shrink-0"
          :class="{'bg-blue-300': field.revealed && field.value > -1,'bg-red-600': field.revealed && field.value === -1, 'bg-blue-400 hover:bg-blue-500 focus:bg-blue-500 ': !field.revealed}">
    <svg v-if="field.marked && !field.revealed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
         fill="currentColor" width="1em"
         height="1em">
      <path fill-rule="evenodd"
            d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
            clip-rule="evenodd"/>
    </svg>
    <svg v-else-if="field.revealed && field.value === -1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
         fill="currentColor" width="1em" height="1em">
      <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
            clip-rule="evenodd"/>
    </svg>
    <span v-else>{{ field.revealed && field.value > 0 ? field.value : '' }}</span>
  </button>
</template>

<script>
import Field from "@/models/Field.js";

export default {
  props: {
    field: Field,
    result: String
  },
  data() {
    return {}
  },
  methods: {
    mark(e) {
      e.preventDefault();
      this.$emit('mark');
    }
  }
}
</script>

<style>
.shadowy {
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.4);
}

.shadowy:active {
  box-shadow: inset 2px 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
