import Board from "./components/Board";
import BoardField from "./components/BoardField"

const app = Vue.createApp({
    components: {
        'board': Board,
    }
});

app.mount('#app')

