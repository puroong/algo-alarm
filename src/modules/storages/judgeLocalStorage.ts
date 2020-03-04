import Storage from "./storage";
import ContestMap from "../dtos/contestMap";
import Contest from "../dtos/contest";
import JudgeStorage from "./judgeStorage";
import LocalStorage from "./localStorage";
import RenderContestsMessage from "../messages/renderContestsMessage";
import JudgePort from "../judgePort";

class JudgeLocalStorage extends JudgeStorage {
    storage: Storage = new LocalStorage();

    async getContests(): Promise<ContestMap> {
        const keys = [JudgeStorage.KEY.CONTESTS];
        const rawContestMap = await this.storage.get(keys);
        const rawContests = rawContestMap[JudgeStorage.KEY.CONTESTS] || {};
        const contests = this.toContests(rawContests);

        return contests;
    }

    private toContests(rawContests: any): ContestMap {
        const contests: ContestMap = {};
        const contestKeys = Object.keys(rawContests);

        contestKeys.forEach(key => {
            const contest = new Contest(
                rawContests[key].siteName,
                rawContests[key].siteUrl,
                rawContests[key].name,
                rawContests[key].beginAt,
                rawContests[key].endAt,
                rawContests[key].duration
            )

            if (this.isValidContest(contest)) contests[key] = contest;
        });

        return contests;
    }

    private isValidContest(contest: Contest): boolean {
        return !contest.isOver();
    }

    async setContests(contests: ContestMap): Promise<void> {
        const contestsItem = {
            [JudgeStorage.KEY.CONTESTS]: contests
        }

        await this.storage.set(contestsItem)
    }

    async getBadgeColor(): Promise<string> {
        const keys = [JudgeStorage.KEY.BADGECOLOR];
        const badgeColor = await this.storage.get(keys);

        return badgeColor;
    }

    async setBadgeColor(badgeColor: string): Promise<void> {
        const badgeColorItem = {
            [JudgeStorage.KEY.BADGECOLOR]: badgeColor
        };

        await this.storage.set(badgeColorItem);
    }

    setStorageOnChangedListener(port: JudgePort) {
        chrome.storage.onChanged.addListener(function (changes: any, namespaces: any) {
            this.renderChanges(changes, namespaces, port)
        }.bind(this));
    }

    private renderChanges(changes: any, namespaces: any, port: JudgePort) {
        this.renderBadgeColor(changes);
        this.renderBadgeTextAndContests(changes, port);
    }

    private renderBadgeColor(changes: any) {
        let badgeColor: string = null;
        if (changes[JudgeStorage.KEY.BADGECOLOR]) {
            badgeColor = changes[JudgeStorage.KEY.BADGECOLOR].newValue;
        }

        if (badgeColor) {
            chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });
        }
    }

    private renderBadgeTextAndContests(changes: any, port: JudgePort) {
        const rawContests = changes[JudgeStorage.KEY.CONTESTS] || {};
        const newRawContests = rawContests.newValue;

        if(newRawContests) {
            const contests = this.toContests(newRawContests);

            const nOnGoing: string = this.CntOnGoing(contests);
            const nComing: string = this.CntComing(contests);
            chrome.browserAction.setBadgeText({text: `${nComing}/${nOnGoing}`});

            if(port.isPortSet()) this.sendRenderMessage(port, contests);
        }
    }

    private CntOnGoing(contests: ContestMap): string {
        const contestKeys = Object.keys(contests);
        const onGoingContestKeys = contestKeys.filter(key => contests[key].isOnGoing());
        return onGoingContestKeys.length.toString();
    }

    private CntComing(contests: ContestMap): string {
        const contestKeys = Object.keys(contests);
        const ComingContestKeys = contestKeys.filter(key => contests[key].isComing());
        return ComingContestKeys.length.toString();
    }

    private sendRenderMessage(port: JudgePort, contests: ContestMap) {
        port.postMessage(new RenderContestsMessage(contests));
    }
}

export default JudgeLocalStorage;