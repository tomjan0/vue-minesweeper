import BoardField from "./BoardField.js";


const Board = {
    components: {
        'board-field': BoardField
    },
    props: {
        size: Object,
        bombs: Number,
    },
    watch: {
        size: function (newSize) {
            console.log('watch')
            // this.width = newSize.width;
            // this.height = newSize.height;
            this.width = this.size.width;
            this.height = this.size.height;
            this.createGame();
        },
    },
    created() {
        // console.log('create')
        this.width = this.size.width;
        this.height = this.size.height;
        this.createGame();
    },
    data() {
        return {
            width: undefined,
            height: undefined,
            fields: undefined,
            fieldsLeft: undefined
        }
    },
    methods: {
        getField(x, y) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                return this.fields[y][x];
            }
            return null;
        },
        createGame() {
            let bombsPositions = [];
            while (bombsPositions.length < this.bombs) {
                const x = Math.floor(Math.random() * this.width);
                const y = Math.floor(Math.random() * this.height);
                if (bombsPositions.findIndex(pos => pos.x === x && pos.y === y) === -1) {
                    bombsPositions.push({x, y});
                }
            }

            const fields = [];
            for (let y = 0; y < this.height; y++) {
                fields.push([]);
                for (let x = 0; x < this.width; x++) {
                    fields[y].push(new Field(FieldTypes.NORMAL));
                }
            }
            this.fields = fields;

            const neighbours = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
            for (const {x, y} of bombsPositions) {
                // console.log(x, y);
                fields[y][x] = new Field(FieldTypes.BOMB);

                for (const [dx, dy] of neighbours) {
                    const field = this.getField(x + dx, y + dy);
                    if (field && field.type === FieldTypes.NORMAL) {
                        field.value++;
                    }
                }
            }


            this.fieldsLeft = this.width * this.height - this.bombs;

            // console.log(fields);

        },
        reveal(field, x, y) {
            // console.log(x, y);
            field.revealed = true;
            if (field.value === 0) {
                const neighbours = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
                for (const [dx, dy] of neighbours) {
                    const nextField = this.getField(x + dx, y + dy);
                    if (nextField && nextField.type === FieldTypes.NORMAL && !nextField.revealed) {
                        this.reveal(nextField, x + dx, y + dy);
                    }
                }
            }
            if (field.value > -1) {
                this.fieldsLeft--;
            }
        }
    },
    template: `
        <div>
<!--        <p class="text-xl">Fields left: {{fieldsLeft}}</p>-->
        <div class="rounded overflow-hidden">
            <div class="flex flex-row" v-for="(row,idy) in fields">
                <board-field v-for="(field,idx) in row" @reveal="reveal(field,idx,idy)" :revealed="field.revealed"  :type="field.type" :value="field.value"></board-field>
            </div>
        </div>
        </div>
`
}


const FieldTypes = {
    NORMAL: 'normal',
    BOMB: 'bomb'
}

class Field {
    type
    value
    revealed

    constructor(type) {
        this.type = type;
        this.value = type === FieldTypes.NORMAL ? 0 : -1;
        this.revealed = false;
    }
}

export default Board
