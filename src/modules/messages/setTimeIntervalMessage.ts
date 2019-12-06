import Message from './message';
import Constant from '../constant';
import ContestMap from '../types/contestMap';

class SetTimeIntervalMessage implements Message{
    command: string;
    data: any;
    constructor(data: ContestMap) {
        this.command = Constant.MessageType.SETTIMEINTERVAL;
        this.data = data;
    }
}

export default SetTimeIntervalMessage;