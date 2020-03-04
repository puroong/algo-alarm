import Message from './message';
import ContestMap from '../dtos/contestMap';

class RenderContestsMessage implements Message{
    static TYPE = "RenderContestsMessage";

    data: any;
    type: string = RenderContestsMessage.TYPE;
    constructor(data: ContestMap) {
        this.data = data;
    }
}

export default RenderContestsMessage;