import Storage from "./storage";
import ContestMap from "../dtos/contestMap";
import Contest from "../dtos/contest";
import JudgeStorage from "./judgeStorage";
import LocalStorage from "./localStorage";

class JudgeLocalStorage extends JudgeStorage {
    storage: Storage = new LocalStorage();

    async getContests(): Promise<ContestMap> {
        const keys = [JudgeStorage.KEY.CONTESTS];
        const rawContestMap = await this.storage.get(keys);
        const contests = this.toContests(rawContestMap);

        return contests;
    }

    private toContests(rawContestMap: any): ContestMap {
        const rawContests: ContestMap = rawContestMap[JudgeStorage.KEY.CONTESTS] || {};
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

            if(this.isValidContest(contest)) contests[key] = contest;
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
}

export default JudgeLocalStorage;