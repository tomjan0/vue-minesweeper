import Board from "./components/Board.js";
import BoardField from "./components/BoardField.js"

const app = Vue.createApp({
    components: {
        'board': Board,
    }
});

app.mount('#app')

