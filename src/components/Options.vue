<template>
  <transition
    enter-active-class="transition-all transform"
    leave-active-class="transition-all transform"
    enter-from-class="translate-x-40"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-40"
  >
    <div
      v-if="menuOpen"
      class="fixed right-0 h-full w-40 p-2 flex flex-col bg-white bg-opacity-50 backdrop-blur text-gray-700 z-10"
    >
      <div class="font-bold mb-1 text-center">Zoom</div>
      <div class="flex flex-row justify-around items-center">
        <button
          class="p-1 rounded-full hover:bg-gray-500 hover:bg-opacity-25 focus:outline-none focus:ring"
          @click="$emit('update:zoom', Math.max(zoom - 10, 0))"
        >
          <ZoomOutIcon />
        </button>
        <div class="text-sm">{{ zoom }}%</div>
        <button
          class="p-1 rounded-full hover:bg-gray-500 hover:bg-opacity-25 focus:outline-none focus:ring"
          @click="$emit('update:zoom', zoom + 10)"
        >
          <ZoomInIcon />
        </button>
      </div>
      <div class="font-bold mb-1 text-center">Choose size</div>
      <div class="flex flex-col text-sm space-y-1 mb-2">
        <button
          v-for="(option, index) in options"
          :key="option.width"
          class="px-2 py-1 focus:outline-none rounded text-xs transition-colors duration-75 focus:ring"
          :class="
            chosenOption === index
              ? 'bg-gray-500 bg-opacity-40'
              : 'hover:bg-gray-500 hover:bg-opacity-25'
          "
          @click="$emit('update:chosen-option', index)"
        >
          {{ option.width }}x{{ option.height }} ({{ option.bombs }})
        </button>
      </div>
      <button
        class="px-2 py-1 border-2 border-gray-700 shadow-lg rounded font-bold mb-1 focus:outline-none focus:ring hover:bg-black hover:bg-opacity-10"
        @click="$emit('start-game')"
      >
        New game
      </button>
      <button
        :class="gameInProgress && 'hover:bg-black hover:bg-opacity-10'"
        :disabled="!gameInProgress"
        class="px-2 py-1 border-2 border-gray-700 shadow-lg rounded font-bold mb-1 focus:outline-none focus:ring disabled:opacity-50"
        @click="$emit('save-game')"
      >
        Save
      </button>
      <div class="font-bold mb-1 text-center">Saved Games</div>
      <div class="flex flex-col text-sm space-y-1 mb-2 overflow-auto">
        <button
          v-for="game in formattedSavedGames"
          :key="game.id"
          class="px-2 py-1 focus:outline-none rounded text-xs transition-colors duration-75 focus:ring hover:bg-gray-500 hover:bg-opacity-25"
          @click="$emit('load-game', game.id)"
        >
          {{ game.title }}
        </button>
      </div>
    </div>
  </transition>
  <button
    :class="menuOpen && '-rotate-90 -translate-x-40'"
    class="fixed top-4 right-4 bg-white bg-opacity-50 backdrop-blur hover:bg-opacity-70 transition-transform text-gray-700 transform focus:outline-none focus:ring w-8 h-8 rounded-full flex justify-center items-center text-xl z-10"
    @click="menuOpen = !menuOpen"
  >
    <CloseIcon v-if="menuOpen" />
    <CogIcon v-else />
  </button>
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import CogIcon from "@/components/icons/CogIcon.vue";
import CloseIcon from "@/components/icons/CloseIcon.vue";
import ZoomOutIcon from "@/components/icons/ZoomOutIcon.vue";
import ZoomInIcon from "@/components/icons/ZoomInIcon.vue";

defineEmits([
  "start-game",
  "save-game",
  "load-game",
  "update:zoom",
  "update:chosen-option",
]);

const props = defineProps({
  gameInProgress: Boolean,
  zoom: { type: Number, default: 100 },
  options: { type: Array, default: () => [] },
  chosenOption: { type: Number, default: 0 },
  savedGames: { type: Array, default: () => [] },
});

const { savedGames } = toRefs(props);

const formattedSavedGames = computed(() => {
  return savedGames.value.map((gameId) => {
    const gameData = JSON.parse(localStorage.getItem(gameId));
    return {
      id: gameId,
      title: new Date(gameData.lastSavedOn).toLocaleString(),
    };
  });
});

const menuOpen = ref(true);
</script>
