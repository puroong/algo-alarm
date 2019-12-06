import Constant from '../constant';
import RenderContestsMessage from './renderContestsMessage';
import UpdateTimeMessage from './updateTimeMessage';
import Contest from '../types/contest';
import ContestMap from '../types/contestMap';
import SetTimeIntervalMessage from './setTimeIntervalMessage';
import UnsetTimeIntervalMessage from './unsetTimeIntervalMessage';

class MessageFactory {
    static createMessage(msgType: string, data: any) {
        if (msgType === Constant.MessageType.RENDERCONTESTS) return new RenderContestsMessage(data as ContestMap);
        else if (msgType === Constant.MessageType.UPDATETIME) return new UpdateTimeMessage(data as Contest);
        else if(msgType === Constant.MessageType.SETTIMEINTERVAL) return new SetTimeIntervalMessage(data as ContestMap);
        else if(msgType === Constant.MessageType.UNSETTIMEINTERVAL) return new UnsetTimeIntervalMessage(data as null);
    }
}

export default MessageFactory;