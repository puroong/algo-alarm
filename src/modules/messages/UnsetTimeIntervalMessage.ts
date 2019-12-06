import Message from './message';
import Constant from '../constant';
import ContestMap from '../types/contestMap';

class UnsetTimeIntervalMessage extends Message {
    constructor(data: null) {
        super(Constant.MessageType.UNSETTIMEINTERVAL, data);
    }
}

export default UnsetTimeIntervalMessage;