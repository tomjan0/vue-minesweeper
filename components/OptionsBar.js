const OptionsBar = {
    template: `
    <div class="h-12 w-full bg-blue-800 flex flex-row justify-center">
        <div class=" w-full flex flex-row justify-center items-center text-xs">
            <button class="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l-lg ">9x9</button>
            <button class="px-2 py-1 bg-gray-200 hover:bg-gray-300 border-l border-r border-gray-400">15x15</button>
            <button class="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r-lg">30x30</button>
        </div>
        <div class="flex justify-center items-center">
            <button class="bg-blue-400 hover:bg-blue-500 shadowy-inset text-sm px-3 py-1 rounded-lg font-bold text-white">PLAY</button>
        </div>
        <div class="w-full"></div>
    </div>
    `
}

export default OptionsBar
