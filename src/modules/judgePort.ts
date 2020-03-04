import Port = chrome.runtime.Port;
import IntervalQueue from "./IntervalQueue";
import Message from "./messages/message";
import SetTimeIntervalMessage from "./messages/setTimeIntervalMessage";
import ContestMap from "./dtos/contestMap";
import Contest from "./dtos/contest";
import UpdateTimeMessage from "./messages/updateTimeMessage";
import JudgeStorage from "./storages/judgeStorage";
import UnsetTimeIntervalMessage from "./messages/unsetTimeIntervalMessage";
import PortMessageEvent = chrome.runtime.PortMessageEvent;

class JudgePort {
    private intervalQueue = new IntervalQueue();
    private port: Port = null;

    isPortSet(): boolean {
        return this.port !== null;
    }
    setOnConnectListener() {
        chrome.runtime.onConnect.addListener(this.onConnectListener.bind(this));
    }

    private onConnectListener(port: Port) {
        this.setPort(port);

        this.port.onMessage.addListener(this.onMessageListener.bind(this));
        this.port.onDisconnect.addListener(this.onDisconnectListener.bind(this));
    }

    private setPort(port: Port) {
        this.port = port;
    }

    private onMessageListener(message: Message) {
        if (message.type === SetTimeIntervalMessage.TYPE) {
            const rawContests: any = message.data;
            const contests = this.toContests(rawContests);
            this.validateContests(contests);
        } else if (message.type === UnsetTimeIntervalMessage.TYPE) {
            this.intervalQueue.clear();
        }

    }

    private toContests(rawContests: any): ContestMap {
        const contestKeys: string[] = Object.keys(rawContests);
        const contests: ContestMap = {};
        contestKeys.forEach(key => contests[key] = new Contest(
            rawContests[key].siteName,
            rawContests[key].siteUrl,
            rawContests[key].name,
            rawContests[key].beginAt,
            rawContests[key].endAt,
            rawContests[key].duration
        ));

        return contests;
    }

    private validateContests(contests: ContestMap) {
        this.intervalQueue.clear();

        const contestKeys = Object.keys(contests);
        for (let key of contestKeys) {
            const interval: number = setInterval(function () {
                if(this.isPortSet()) this.port.postMessage(new UpdateTimeMessage(contests[key]));

                if (contests[key].isOver()) {
                    delete contests[key];
                    clearInterval(interval);
                    this.storage.set({ [JudgeStorage.KEY.CONTESTS]: contests }, function () { });
                }
            }.bind(this), 1000);
            this.intervalQueue.push(interval);
        }
    }

    private onDisconnectListener() {
        this.intervalQueue.clear();
    }

    postMessage(message: Message) {
        this.port.postMessage(message);
    }

    connect(name: string) {
        this.port = chrome.runtime.connect({
            name: name
        })
    }

    onMessage(): PortMessageEvent {
        return this.port.onMessage;
    }
}

export default JudgePort;