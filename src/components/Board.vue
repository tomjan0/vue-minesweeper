<template>
  <div class="p-4 m-auto overflow-auto">
    <div class="overflow-auto">
      <div class="flex flex-row" v-for="(row,idy) in fields" :key="`r${row}y${idy}`">
        <board-field v-for="(field,idx) in row" :key="`f${field}y${idx}`" @reveal="reveal(field,idx,idy)"
                     @mark="mark(field)" :field="field"></board-field>
      </div>
    </div>
  </div>
</template>

<script>


import BoardField from "@/components/BoardField.vue";
import Field, {FieldTypes} from "@/models/Field.js";

export default {
  components: {
    BoardField
  },
  props: {
    size: {
      width: Number,
      height: Number
    },
    bombs: Number,
  },
  watch: {
    size: function () {
      this.createGame();
    },
  },
  created() {
    // console.log('create')
    this.createGame();
  },
  data() {
    return {
      fields: undefined,
      fieldsLeft: undefined
    }
  },
  methods: {
    getField(x, y) {
      if (x >= 0 && x < this.size.width && y >= 0 && y < this.size.height) {
        return this.fields[y][x];
      }
      return null;
    },
    createGame() {
      let bombsPositions = [];
      while (bombsPositions.length < this.bombs) {
        const x = Math.floor(Math.random() * this.size.width);
        const y = Math.floor(Math.random() * this.size.height);
        if (bombsPositions.findIndex(pos => pos.x === x && pos.y === y) === -1) {
          bombsPositions.push({x, y});
        }
      }

      const fields = [];
      for (let y = 0; y < this.size.height; y++) {
        fields.push([]);
        for (let x = 0; x < this.size.width; x++) {
          fields[y].push(new Field(FieldTypes.NORMAL));
        }
      }
      this.fields = fields;

      const neighbours = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      for (const {x, y} of bombsPositions) {
        // console.log(x, y);
        fields[y][x] = new Field(FieldTypes.BOMB);

        for (const [dx, dy] of neighbours) {
          const field = this.getField(x + dx, y + dy);
          if (field && field.type === FieldTypes.NORMAL) {
            field.value++;
          }
        }
      }


      this.fieldsLeft = this.size.width * this.size.height - this.bombs;

      // console.log(fields);

    },
    reveal(field, x, y) {
      // console.log(x, y);
      field.revealed = true;
      if (field.value === 0) {
        const neighbours = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (const [dx, dy] of neighbours) {
          const nextField = this.getField(x + dx, y + dy);
          if (nextField && nextField.type === FieldTypes.NORMAL && !nextField.revealed) {
            this.reveal(nextField, x + dx, y + dy);
          }
        }
      }
      if (field.value > -1) {
        this.fieldsLeft--;
      }
    },
    mark(field) {
      field.marked = !field.marked;
    }
  }
}


</script>
