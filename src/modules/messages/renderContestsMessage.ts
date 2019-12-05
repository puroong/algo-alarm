import Message from './message';
import Constant from '../constant';
import ContestMap from '../types/contestMap';

class RenderContestsMessage extends Message{
    constructor(data: ContestMap) {
        super(Constant.MessageType.RENDERCONTESTS, data);
    }
}

export default RenderContestsMessage;