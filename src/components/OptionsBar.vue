<template>
  <div class="h-12 flex-grow flex flex-row justify-center bg-blue-200">
    <div class=" w-full flex flex-row justify-center items-center text-xs">
      <button class="px-2 py-1 bg-gray-200 rounded-l-lg" @click="changeOption(0)"
              :class="{'bg-blue-500': currentOption === 0}">9x9
      </button>
      <button class="px-2 py-1 bg-gray-200 border-l border-r border-gray-400" @click="changeOption(1)"
              :class="{'bg-blue-500': currentOption === 1}">15x15
      </button>
      <button class="px-2 py-1 bg-gray-200 rounded-r-lg" @click="changeOption(2)"
              :class="{'bg-blue-500': currentOption === 2}">30x30
      </button>
    </div>
    <div class="flex justify-center items-center">
      <button @click="startGame()" class="px-2 py-1 text-gray-700  font-bold  rounded-sm hover:text-4xl">
        {{ gameInProgress ? 'RESTART' : 'PLAY' }}
      </button>
    </div>
    <div class="w-full"></div>
  </div>
</template>

<script>

export default {
  props: {
    gameInProgress: Boolean
  },
  data: () => {
    return {
      currentOption: 0
    }
  },
  methods: {
    changeOption(target) {
      this.currentOption = target;
      this.$emit('change-option', target);
    },
    startGame() {
      this.$emit('start-game');
    }
  }
}
</script>
