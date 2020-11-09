import Board from "./components/Board.js";
import BoardField from "./components/BoardField.js"
import OptionsBar from "./components/OptionsBar.js";

const app = Vue.createApp({
    components: {
        'board': Board,
        'options-bar': OptionsBar
    },
    data: function () {
        return {
            width: 9,
            height: 9
        }
    },
    methods: {
        toggleSize(width, height) {
            this.width = width;
            this.height = height;
        }
    }
});

app.mount('#app')

