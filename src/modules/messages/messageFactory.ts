import Constant from '../constant';
import RenderContestsMessage from './renderContestsMessage';
import UpdateTimeMessage from './updateTimeMessage';
import Contest from '../types/contest';
import ContestMap from '../types/contestMap';

class MessageFactory {
    static createMessage(msgType: string, data: any) {
        if (msgType === Constant.MessageType.RENDERCONTESTS) return new RenderContestsMessage(data as ContestMap);
        else if (msgType === Constant.MessageType.UPDATETIME) return new UpdateTimeMessage(data as Contest);
    }
}

export default MessageFactory;