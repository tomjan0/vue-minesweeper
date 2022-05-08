<template>
  <button
    :disabled="field.revealed || result.length > 0"
    class="w-8 h-8 flex cursor-pointer shadowy focus:outline-none flex justify-center items-center font-bold flex-shrink-0"
    :class="{
      'bg-blue-300': field.revealed && field.value > -1,
      'bg-red-600': field.revealed && field.value === -1,
      'bg-blue-400 hover:bg-blue-500 focus:bg-blue-500 ': !field.revealed,
    }"
    @click="$emit('reveal')"
    @contextmenu="mark"
  >
    <FlagIcon v-if="field.marked && !field.revealed" />
    <SadFaceIcon v-else-if="field.revealed && field.value === -1" />
    <span v-else>{{
      field.revealed && field.value > 0 ? field.value : ""
    }}</span>
  </button>
</template>

<script>
import Field from "@/models/Field.js";
import SadFaceIcon from "@/components/icons/SadFaceIcon.vue";
import FlagIcon from "@/components/icons/FlagIcon.vue";

export default {
  components: { SadFaceIcon, FlagIcon },
  props: {
    field: { type: [Field, Object], default: () => ({}) },
    result: { type: String, default: "" },
  },
  emits: ["reveal", "mark"],
  data() {
    return {};
  },
  methods: {
    mark(e) {
      e.preventDefault();
      this.$emit("mark");
    },
  },
};
</script>

<style>
.shadowy {
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.4);
}

.shadowy:active {
  box-shadow: inset 2px 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
