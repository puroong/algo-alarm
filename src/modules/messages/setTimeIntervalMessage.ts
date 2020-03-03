import Message from './message';
import ContestMap from '../dtos/contestMap';

class SetTimeIntervalMessage implements Message{
    static TYPE = "SetTimeIntervalMessage";

    data: any;
    type: string = SetTimeIntervalMessage.TYPE;
    constructor(data: ContestMap) {
        this.data = data;
    }

}

export default SetTimeIntervalMessage;