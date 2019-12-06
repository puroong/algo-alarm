import Message from './message';
import Constant from '../constant';

class UnsetTimeIntervalMessage implements Message {
    command: string;
    data: any;
    constructor(data: null) {
        this.command = Constant.MessageType.UNSETTIMEINTERVAL;
        this.data = data;
    }
}

export default UnsetTimeIntervalMessage;