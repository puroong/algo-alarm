import Message from './message';
import Constant from '../constant';
import Contest from '../types/contest';

class UpdateTimeMessage implements Message{
    command: string;
    data: any;
    constructor(data: Contest) {
        this.command = Constant.MessageType.UPDATETIME;
        this.data = data;
    }
}

export default UpdateTimeMessage;