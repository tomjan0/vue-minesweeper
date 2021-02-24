<template>
  <button :disabled="field.revealed" @click="reveal" @contextmenu="mark"
          class="w-8 h-8 flex  cursor-pointer shadowy focus:outline-none flex justify-center items-center font-bold flex-shrink-0"
          :class="{'bg-blue-300': field.revealed && field.value > -1,'bg-red-600': field.revealed && field.value === -1, 'bg-blue-400 hover:bg-blue-300': !field.revealed}">
    {{ field.revealed ? field.value > 0 ? field.value : field.value === 0 ? '' : 'B' : field.marked ? 'M' : '' }}
  </button>
</template>

<script>
import Field from "@/models/Field.js";

export default {
  props: {
    field: Field,
  },
  data() {
    return {}
  },
  methods: {
    reveal() {
      this.$emit('reveal');
    },
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
