export default class Field {
    type
    value
    revealed
    marked

    constructor(type) {
        this.type = type;
        this.value = type === FieldTypes.NORMAL ? 0 : -1;
        this.revealed = false;
    }
}

export const FieldTypes = {
    NORMAL: 'normal',
    BOMB: 'bomb'
}
