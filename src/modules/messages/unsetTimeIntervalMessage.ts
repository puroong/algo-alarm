import Message from './message';

class UnsetTimeIntervalMessage implements Message {
    static TYPE = "UnsetTimeIntervalMessage";

    data: any;
    type: string = UnsetTimeIntervalMessage.TYPE;
    constructor(data: null) {
        this.data = data;
    }
}

export default UnsetTimeIntervalMessage;