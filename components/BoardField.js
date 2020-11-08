const BoardField = {
    props: {
        type: String,
        value: Number,
        revealed: Boolean
    },
    // watch: {
    //     revealed
    // },
    data() {
        return {
            marked: false
        }
    },
    methods: {
        reveal() {
            // e.preventDefault();
            // console.log(e)
            // const neighbours = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
            // for (const [dx, dy] of neighbours) {
            //     const field = this.getField(x + dx, y + dy);
            //     if (field && field.type === FieldTypes.NORMAL) {
            //         field.value++;
            //     }
            // }
            // this.revealed = true;
            this.$emit('reveal');
        },
        mark(e) {
            e.preventDefault();
            console.log(e);
            this.marked = !this.marked;
        }
    },
    template: `
        <button :disabled="revealed" @click="reveal" @contextmenu="mark" class="w-8 h-8 flex  cursor-pointer shadowy focus:outline-none flex justify-center items-center font-bold" :class="{'bg-blue-300': revealed && value > -1,'bg-red-600': revealed && value === -1, 'bg-blue-400 hover:bg-blue-300': !revealed}">
        {{this.revealed ? this.value > 0 ? this.value : this.value === 0 ? '' : 'B' : this.marked ? 'M' : ''}}
        </button>
    `
}

export default BoardField
