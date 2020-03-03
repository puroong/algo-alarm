import Message from './message';
import Contest from '../dtos/contest';

class UpdateTimeMessage implements Message{
    static TYPE = "UpdateTimeMessage";

    data: any;
    type: string = UpdateTimeMessage.TYPE;
    constructor(data: Contest) {
        this.data = data;
    }
}

export default UpdateTimeMessage;