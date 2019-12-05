import Message from './message';
import Constant from '../constant';
import ContestMap from '../types/contestMap';

class SetTimeIntervalMessage extends Message{
    constructor(data: ContestMap) {
        super(Constant.MessageType.SETTIMEINTERVAL, data);
    }
}

export default SetTimeIntervalMessage;