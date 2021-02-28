<template>
  <div class="p-8 m-auto overflow-auto transform transition" style="transform-origin: 0 0"
       :style="{transform: `scale(${zoom/100})`}">
    <div class="flex flex-row" v-for="(row,idy) in fields" :key="`r${row}y${idy}`">
      <board-field
          :class="checkCorner(idx,idy)" v-for="(field,idx) in row" :key="`f${field}y${idx}`"
          :result="result"
          @reveal="$emit('reveal',{x:idx,y:idy})"
          @mark="$emit('mark',{x:idx,y:idy})" :field="field"></board-field>
    </div>
  </div>
</template>

<script>


import BoardField from "@/components/BoardField.vue";

export default {
  components: {
    BoardField
  },
  emits: ['reveal', 'mark'],
  props: {
    size: {
      width: Number,
      height: Number
    },
    bombs: Number,
    zoom: Number,
    fields: Array,
    result: String
  },
  methods: {
    checkCorner(x, y) {
      return x === 0 && y === 0
          ? 'rounded-tl'
          : x === 0 && y === this.size.height - 1
              ? 'rounded-bl'
              : x === this.size.width - 1 && y === 0
                  ? 'rounded-tr'
                  : x === this.size.width - 1 && y === this.size.height - 1
                      ? 'rounded-br'
                      : '';
    }
  }
}


</script>
