<template>
  <div
      class="fixed top-4 left-1/2 transform -translate-x-1/2 p-2 backdrop-blur rounded bg-white bg-opacity-50 flex flex-row justify-center items-center font-bold uppercase text-gray-700"
  :class="{'bg-red-500': result === 'lose', 'bg-green-500': result === 'win'}">
    <template v-if="result.length">{{ result === 'win' ? 'You won!' : 'You lost!' }}</template>
    <template v-else>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em">
        <path fill-rule="evenodd"
              d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
              clip-rule="evenodd"/>
      </svg>
      <div class="ml-2">{{ bombs }}</div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    bombs: Number,
    result: String
  }
}
</script>
