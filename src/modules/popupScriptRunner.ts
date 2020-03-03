import JudgeStorage from "./storages/judgeStorage";
import Contest from "./dtos/contest";
import ComingContestNodeFactory from "./views/comingContestNodeFactory";
import OnGoingContestNodeFactory from "./views/onGoingContestNodeFactory";
import Port = chrome.runtime.Port;
import SetTimeIntervalMessage from "./messages/setTimeIntervalMessage";
import ContestMap from "./dtos/contestMap";
import TimeFormatter from "./utils/timeFormatter";
import Message from "./messages/message";
import RenderContestsMessage from "./messages/renderContestsMessage";
import UpdateTimeMessage from "./messages/updateTimeMessage";

class PopupScriptRunner {
    private storage: JudgeStorage;
    private port: Port;

    constructor(storage: JudgeStorage) {
        this.storage = storage;
        this.port = chrome.runtime.connect({
            name: 'algo-alarm'
        });
    }

    async run() {
        const contests = await this.storage.getContests();

        this.render(contests);
        this.setPortOnMessageListener();
        this.port.postMessage(new SetTimeIntervalMessage(contests));
    }

    private async render(contests: ContestMap) {
        let contestListElement = document.querySelector('.contestList');
        contestListElement.innerHTML = "";

        let keys: string[] = Object.keys(contests);
        let sortedKeys = keys.sort((a, b) => contests[a].beginAt - contests[b].beginAt);

        for (let key of sortedKeys) {
            let item: Contest = contests[key];
            let node = null;

            if (item.isComing()) node = ComingContestNodeFactory.create(item);
            else if (item.isOnGoing()) node = OnGoingContestNodeFactory.create(item);

            if (node !== null) contestListElement.appendChild(node);
        }
    }

    private setPortOnMessageListener() {
        this.port.onMessage.addListener(this.portOnMessageListener.bind(this));
    }

    private portOnMessageListener(message: Message) {
        if (message.type === RenderContestsMessage.TYPE) {
            const rawContests: any = message.data;
            const contestKeys: string[] = Object.keys(rawContests);
            let contests: ContestMap = {};
            contestKeys.forEach(key => contests[key] = new Contest(
                rawContests[key].siteName,
                rawContests[key].siteUrl,
                rawContests[key].name,
                rawContests[key].beginAt,
                rawContests[key].endAt,
                rawContests[key].duration
            ));

            this.render(contests);
        }
        else if (message.type === UpdateTimeMessage.TYPE) {
            const rawContest: any = message.data;
            const contest = new Contest(
                rawContest.siteName,
                rawContest.siteUrl,
                rawContest.name,
                rawContest.beginAt,
                rawContest.endAt,
                rawContest.duration
            );

            this.updateDue(contest);
        }
    }
    private updateDue(contest: Contest) {
        const dueText = document.querySelector('p.until[data-contestname="' + contest.name + '"]');

        if (contest.isComing()) dueText.textContent = TimeFormatter.until2Readable(contest.beginAt - Date.now());
        else if (contest.isOnGoing()) dueText.textContent = TimeFormatter.until2Readable(contest.endAt - Date.now());
    };
}

export default PopupScriptRunner;