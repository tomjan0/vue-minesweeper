<template>
  <div class="app-root">
    <options-bar :game-in-progress="gameInProgress" @start-game="startGame()"
                 @change-option="changeOption($event)"></options-bar>
    <div class="flex flex-grow">
      <board v-if="gameInProgress" :size="currentSize" :bombs="10"></board>
    </div>
  </div>
</template>

<script>

import Board from "@/components/Board.vue";
import OptionsBar from "@/components/OptionsBar.vue";

export default {
  components: {
    Board,
    OptionsBar
  },
  data: function () {
    return {
      chosenSize: {
        width: 9,
        height: 9,
      },
      currentSize: {
        width: 9,
        height: 9
      },
      gameInProgress: false
    }
  },
  methods: {
    changeSize(width, height) {
      this.chosenSize.width = width;
      this.chosenSize.height = height;
    },
    startGame() {
      this.gameInProgress = true;
      this.currentSize = {...this.chosenSize};
    },
    changeOption(option) {
      switch (option) {
        case 0:
          this.changeSize(9, 9);
          break;
        case 1:
          this.changeSize(15, 15);
          break;
        case 2:
          this.changeSize(30, 30);
          break;
        default:
          this.changeSize(9, 9);
      }
    }
  }
}
</script>

<style>
:root {
  font-size: calc(10px + 2vmin);
}
.app-root {
  width: 100vw;
  height: 100vh;
}

</style>
