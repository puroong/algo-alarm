import Message from './message';
import Constant from '../constant';
import ContestMap from '../types/contestMap';

class RenderContestsMessage implements Message{
    command: string;
    data: any;
    constructor(data: ContestMap) {
        this.command = Constant.MessageType.RENDERCONTESTS;
        this.data = data;
    }
}

export default RenderContestsMessage;