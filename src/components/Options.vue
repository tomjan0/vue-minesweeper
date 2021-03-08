<template>
  <transition
      enter-active-class="transition-all transform"
      leave-active-class="transition-all transform"
      enter-from-class="translate-x-40"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-40">
    <div v-if="menuOpen"
         class="fixed right-0 h-full w-40 p-2 flex flex-col bg-white bg-opacity-50 backdrop-blur text-gray-700 z-10">
      <div class="font-bold mb-1 text-center">Zoom</div>
      <div class="flex flex-row justify-around items-center">
        <button @click="$emit('update:zoom', Math.max(zoom - 10,0))"
                class="p-1 rounded-full hover:bg-gray-500 hover:bg-opacity-25 focus:outline-none focus:ring">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em">
            <path fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M5 8a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
        <div class="text-sm">{{ zoom }}%</div>
        <button @click="$emit('update:zoom', zoom + 10)"
                class="p-1 rounded-full hover:bg-gray-500 hover:bg-opacity-25 focus:outline-none focus:ring">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em">
            <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z"/>
            <path fill-rule="evenodd"
                  d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z"
                  clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
      <div class="font-bold mb-1 text-center">Choose size</div>
      <div class="flex flex-col text-sm space-y-1 mb-2">
        <button v-for="(option, index) in options" :key="option.width"
                class="px-2 py-1 focus:outline-none rounded text-xs transition-colors duration-75 focus:ring"
                @click="$emit('update:chosen-option', index)"
                :class="chosenOption === index ? 'bg-gray-500 bg-opacity-40' : 'hover:bg-gray-500 hover:bg-opacity-25'">
          {{ option.width }}x{{ option.height }} ({{ option.bombs }})
        </button>
      </div>
      <button @click="$emit('start-game')"
              class="px-2 py-1 border-2 border-gray-700 shadow-lg rounded font-bold mb-1 focus:outline-none focus:ring hover:bg-black hover:bg-opacity-10">
        New game
      </button>
      <button :class="gameInProgress && 'hover:bg-black hover:bg-opacity-10'"
              :disabled="!gameInProgress"
              class="px-2 py-1 border-2 border-gray-700 shadow-lg rounded font-bold mb-1 focus:outline-none focus:ring  disabled:opacity-50"
              @click="$emit('save-game')">
        Save
      </button>
      <div class="font-bold mb-1 text-center">Saved Games</div>
      <div class="flex flex-col text-sm space-y-1 mb-2 overflow-auto">
        <button v-for="(game) in formattedSavedGames" :key="game.id" @click="$emit('load-game',game.id)"
                class="px-2 py-1 focus:outline-none rounded text-xs transition-colors duration-75 focus:ring hover:bg-gray-500 hover:bg-opacity-25">
          {{ game.title }}
        </button>
      </div>
    </div>
  </transition>
  <button
      :class="menuOpen && '-rotate-90 -translate-x-40'"
      class="fixed top-4 right-4 bg-white bg-opacity-50 backdrop-blur  hover:bg-opacity-70 transition-transform text-gray-700 transform  focus:outline-none focus:ring w-8 h-8 rounded-full flex justify-center items-center text-xl z-10"
      @click="menuOpen = !menuOpen">
    <svg v-if="menuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
         width="1em" height="1em">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke="currentColor" width="1em"
         height="1em">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  </button>
</template>

<style>

</style>

<script>

export default {
  props: {
    gameInProgress: Boolean,
    zoom: Number,
    options: Array,
    chosenOption: Number,
    savedGames: Array
  },
  emits: [
    'start-game',
    'save-game',
    'load-game',
    'update:zoom',
    'update:chosen-option'
  ],
  computed: {
    formattedSavedGames() {
      return this.savedGames.map(gameId => {
        const ms = parseInt(gameId.slice(5));
        console.log(gameId);
        console.log(ms);
        const date = new Date(ms);
        console.log(date);
        return {
          id: gameId,
          title: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
        };
      })
    }
  },
  data: () => {
    return {
      menuOpen: true,
    }
  },
}
</script>
