<template>
  <div
    class="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 backdrop-blur rounded bg-white bg-opacity-75 flex flex-row justify-center items-center font-bold uppercase text-gray-700"
    :class="{
      'bg-red-500': result === 'lose',
      'bg-green-500': result === 'win',
    }"
  >
    <template v-if="result.length">{{
      result === "win" ? "You won!" : "You lost!"
    }}</template>
    <template v-else>
      <FlagIcon />
      <div class="ml-2">{{ bombs }}</div>
    </template>
    <div class="ml-4 mr-4 w-0.5 float-none bg-gray-700 rounded-full">
      {{ "&nbsp;" }}
    </div>
    <ClockIcon />
    <span class="ml-2">{{ formattedTime }}</span>
  </div>
</template>

<script setup>
import FlagIcon from "@/components/icons/FlagIcon.vue";
import ClockIcon from "@/components/icons/ClockIcon.vue";
import { computed, toRefs } from "@vue/reactivity";

const props = defineProps({
  bombs: { type: Number, default: 0 },
  result: { type: String, default: "" },
  time: {
    type: Number,
    default: 0,
  },
});

const { time } = toRefs(props);

const formattedTime = computed(
  () =>
    `${Math.floor(time.value / 60)}:` +
    `${Math.floor(time.value % 60)}`.padStart(2, "0")
);
</script>
