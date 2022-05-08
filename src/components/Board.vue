<template>
  <div
    class="p-8 m-auto overflow-auto transform transition"
    style="transform-origin: 0 0"
    :style="{ transform: `scale(${zoom / 100})` }"
  >
    <div
      v-for="(row, idy) in fields"
      :key="`r${row}y${idy}`"
      class="flex flex-row"
    >
      <board-field
        v-for="(field, idx) in row"
        :key="`f${field}y${idx}`"
        :class="checkCorner(idx, idy)"
        :result="result"
        :field="field"
        @reveal="$emit('reveal', { x: idx, y: idy })"
        @mark="$emit('mark', { x: idx, y: idy })"
      ></board-field>
    </div>
  </div>
</template>

<script>
import BoardField from "@/components/BoardField.vue";

export default {
  components: {
    BoardField,
  },
  props: {
    size: {
      type: Object,
      default: () => ({ width: 9, height: 9, bombs: 10 }),
    },
    bombs: { type: Number, default: 10 },
    zoom: { type: Number, default: 100 },
    fields: { type: Array, default: () => [] },
    result: { type: String, default: "" },
  },
  emits: ["reveal", "mark"],
  methods: {
    checkCorner(x, y) {
      return x === 0 && y === 0
        ? "rounded-tl"
        : x === 0 && y === this.size.height - 1
        ? "rounded-bl"
        : x === this.size.width - 1 && y === 0
        ? "rounded-tr"
        : x === this.size.width - 1 && y === this.size.height - 1
        ? "rounded-br"
        : "";
    },
  },
};
</script>
