import Message from './message';
import Constant from '../constant';
import Contest from '../types/contest';

class UpdateTimeMessage extends Message{
    static command: string = 'updateTime';

    constructor(data: Contest) {
        super(Constant.MessageType.UPDATETIME, data);
    }
}

export default UpdateTimeMessage;