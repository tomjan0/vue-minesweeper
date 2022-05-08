<template>
  <div
    class="w-screen h-screen bg-gradient-to-br from-blue-200 to-green-300 overflow-auto"
  >
    <div class="flex flex-row h-full flex-grow bg-pattern">
      <options
        v-model:zoom="zoom"
        v-model:chosen-option="chosenOption"
        :game-in-progress="gameInProgress"
        :options="options"
        :saved-games="savedGames"
        @start-game="startGame()"
        @save-game="saveGame"
        @load-game="loadGame"
      ></options>
      <div class="m-auto">
        <board
          :result="result"
          :zoom="zoom"
          :fields="fields"
          :size="size"
          :bombs="10"
          @reveal="handleReveal"
          @mark="handleMark"
        ></board>
      </div>
    </div>
    <scoreboard
      :result="result"
      :bombs="bombsLeft"
      :time="timer.value"
    ></scoreboard>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
import Options from "@/components/Options.vue";
import Scoreboard from "@/components/Scoreboard.vue";
import Field, { FieldTypes } from "@/models/Field.js";

export default {
  components: {
    Scoreboard,
    Board,
    Options,
  },
  data: function () {
    return {
      options: [
        { width: 9, height: 9, bombs: 10 },
        { width: 16, height: 16, bombs: 40 },
        { width: 30, height: 16, bombs: 99 },
      ],
      chosenOption: 0,
      size: undefined,
      zoom: 100,
      gameInProgress: false,
      result: "",
      fields: [],
      bombsLeft: 0,
      fieldsLeft: 0,
      timer: {
        interval: undefined,
        start: undefined,
        value: 0,
      },
      gameId: "",
      savedGames: [],
    };
  },
  created() {
    this.size = this.options[0];
    this.savedGames =
      JSON.parse(localStorage.getItem("saved-games-list")) || [];
  },
  methods: {
    startGame() {
      this.size = this.options[this.chosenOption];
      this.calcFields();
      this.startTime();
      this.gameId = `game-${Date.now()}`;
      this.gameInProgress = true;
    },
    saveGame() {
      let current;
      if (this.savedGames.includes(this.gameId)) {
        current = JSON.parse(localStorage.getItem(this.gameId));
      } else {
        const list = JSON.parse(localStorage.getItem("saved-games-list")) || [];
        localStorage.setItem(
          "saved-games-list",
          JSON.stringify(list.concat(this.gameId))
        );
        this.savedGames.push(this.gameId);

        current = { createdOn: new Date() };
      }
      const { fields, fieldsLeft, bombsLeft, size, timer, gameId } = this;
      current = {
        ...current,
        fields,
        fieldsLeft,
        bombsLeft,
        size,
        gameId,
        time: timer.value,
        lastSavedOn: new Date(),
      };

      localStorage.setItem(this.gameId, JSON.stringify(current));
    },
    loadGame(gameId) {
      const gameData = JSON.parse(localStorage.getItem(gameId));
      Object.assign(this, gameData);

      this.startTime();
      this.timer.value = gameData.time;
      this.timer.start = this.timer.start - gameData.time * 1000;
      this.gameInProgress = true;
      this.result = "";
    },
    endGame(result) {
      this.stopTime();
      this.result = result;
      this.gameInProgress = false;
    },
    startTime() {
      clearInterval(this.timer.interval);
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
        if (
          bombsPositions.findIndex((pos) => pos.x === x && pos.y === y) === -1
        ) {
          bombsPositions.push({ x, y });
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
      const neighbours = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      for (const { x, y } of bombsPositions) {
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
      this.result = "";
    },
    handleReveal({ x, y }) {
      this.reveal(this.getField(x, y), x, y);
    },
    reveal(field, x, y) {
      field.revealed = true;

      if (field.marked) {
        this.bombsLeft++;
      }

      if (field.type === FieldTypes.BOMB) {
        this.endGame("lose");
      } else {
        if (field.value === 0) {
          const neighbours = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
          ];

          for (const [dx, dy] of neighbours) {
            const nextField = this.getField(x + dx, y + dy);
            if (
              nextField &&
              nextField.type === FieldTypes.NORMAL &&
              !nextField.revealed
            ) {
              this.reveal(nextField, x + dx, y + dy);
            }
          }
        }

        if (field.value > -1) {
          this.fieldsLeft--;
        }

        if (this.fieldsLeft === 0) {
          this.endGame("win");
        }
      }
    },
    handleMark({ x, y }) {
      const field = this.getField(x, y);
      field.marked ? this.bombsLeft++ : this.bombsLeft--;
      field.marked = !field.marked;
    },
  },
};
</script>

<style>
:root {
  font-size: calc(10px + 1.5vmin);
}
</style>
