<template>
  <div class="w-screen h-screen bg-gradient-to-br from-blue-200 to-green-300 overflow-auto">
    <div class="flex flex-row h-full flex-grow bg-pattern">
      <options :game-in-progress="gameInProgress" :options="options" :saved-games="savedGames"
               @start-game="startGame()" @restart-game="restartGame" @save-game="saveGame"
               v-model:zoom="zoom" v-model:chosen-option="chosenOption"></options>
      <div class="m-auto">
        <board :result="result" @reveal="handleReveal" @mark="handleMark" :zoom="zoom" :fields="fields"
               v-if="gameInProgress" :size="size" :bombs="10"></board>
      </div>
    </div>
    <scoreboard :result="result" :bombs="bombsLeft" :time="timer.value"></scoreboard>
  </div>
</template>

<script>

import Board from "@/components/Board.vue";
import Options from "@/components/Options.vue";
import Scoreboard from "@/components/Scoreboard.vue";
import Field, {FieldTypes} from "@/models/Field.js";

export default {
  components: {
    Scoreboard,
    Board,
    Options
  },
  data: function () {
    return {
      options: [
        {width: 9, height: 9, bombs: 10},
        {width: 16, height: 16, bombs: 40},
        {width: 30, height: 16, bombs: 99}
      ],
      chosenOption: 0,
      size: undefined,
      zoom: 100,
      gameInProgress: false,
      result: '',
      fields: [],
      bombsLeft: 0,
      fieldsLeft: 0,
      timer: {
        interval: undefined,
        start: undefined,
        value: 0
      },
      savedGames: []
    }
  },
  created() {
    this.size = this.options[0];
    this.savedGames = JSON.parse(localStorage.getItem('saved-games-list')) || [];
  },
  methods: {
    startGame() {
      this.size = this.options[this.chosenOption];
      this.calcFields();
      this.startTime();
      this.gameInProgress = true;
    },
    restartGame() {
      for (let row of this.fields) {
        for (const field of row) {
          field.reset();
        }
      }
      this.bombsLeft = this.size.bombs;
      this.fieldsLeft = this.fieldsLeft = this.size.width * this.size.height - this.size.bombs;
      this.result = '';
    },
    saveGame() {
      const key = `game-${Date.now()}`;
      const current = JSON.parse(localStorage.getItem('saved-games-list')) || [];
      localStorage.setItem('saved-games-list', JSON.stringify(current.concat(key)));
      localStorage.setItem(key, JSON.stringify(this.fields));
      this.savedGames.push(key);
    },
    endGame(result) {
      this.stopTime();
      this.result = result;
    },
    startTime() {
      clearInterval(this.timer.interval)
      this.timer.value = 0;
      this.timer.start = Date.now();
      this.timer.interval = setInterval(() => {
        const now = Date.now();
        this.timer.value = (now - this.timer.start) / 1000;
      }, 1000);
    },
    stopTime() {
      clearInterval(this.timer.interval);
    },
    getField(x, y) {
      if (x >= 0 && x < this.size.width && y >= 0 && y < this.size.height) {
        return this.fields[y][x];
      }
      return null;
    },
    calcFields() {
      let bombsPositions = [];
      while (bombsPositions.length < this.size.bombs) {
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
        fields[y][x] = new Field(FieldTypes.BOMB);

        for (const [dx, dy] of neighbours) {
          const field = this.getField(x + dx, y + dy);
          if (field && field.type === FieldTypes.NORMAL) {
            field.value++;
          }
        }
      }
      this.fieldsLeft = this.size.width * this.size.height - this.size.bombs;
      this.bombsLeft = this.size.bombs;
      this.result = '';
    },
    handleReveal({x, y}) {
      this.reveal(this.getField(x, y), x, y);
    },
    reveal(field, x, y) {
      field.revealed = true;
      if (field.type === FieldTypes.BOMB) {
        this.endGame('lose');
      } else {
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
        if (this.fieldsLeft === 0) {
          this.endGame('win');
        }
      }
    },
    handleMark({x, y}) {
      const field = this.getField(x, y);
      field.marked ? this.bombsLeft++ : this.bombsLeft--;
      field.marked = !field.marked;
    },
  }
}
</script>

<style>
:root {
  font-size: calc(10px + 1.5vmin);
}

</style>
