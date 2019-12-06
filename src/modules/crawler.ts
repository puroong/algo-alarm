import Storage from './storage';
import Constant from './constant';
import ParserFactory from './parsers/parserFactory';
import ContestMap from './types/contestMap';
import Contest from './types/contest';
import Judge from './types/judge';
import JudgeMap from './types/judgeMap';

class Crawler {
    static crawlContests(): void {
        Storage.getStorage(Constant.StorageType.LOCAL, [Constant.StorageKey.JUDGES], function (obj: any) {
            const rawJudges: any = obj[Constant.StorageKey.JUDGES] || {};
            const judgeKeys = Object.keys(rawJudges)

            let judges: JudgeMap = {};
            judgeKeys.forEach(key => judges[key] = new Judge(
                rawJudges[key].name,
                rawJudges[key].url
            ));

            if (judges === undefined) return;

            for (let key of judgeKeys) {
                let judgeItem: Judge = judges[key];

                let xhr: XMLHttpRequest = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        let newContests: ContestMap = ParserFactory.createParser(judgeItem.name).parse(this.responseText);

                        Storage.getStorage(Constant.StorageType.LOCAL, [Constant.StorageKey.CONTESTS], function (obj: any) {
                            let rawCurContests: any = obj[Constant.StorageKey.CONTESTS] || {};
                            let curContestKeys: string[] = Object.keys(rawCurContests);
                            let curContests: ContestMap = {};

                            curContestKeys.forEach(key => curContests[key] = new Contest(
                                rawCurContests[key].siteName,
                                rawCurContests[key].siteUrl,
                                rawCurContests[key].name,
                                rawCurContests[key].beginAt,
                                rawCurContests[key].endAt,
                                rawCurContests[key].duration
                            ));

                            let validContests: ContestMap = {};
                            for (let key of curContestKeys) {
                                if (!curContests[key].isOver()) validContests[key] = curContests[key];
                            }

                            let totalContests: ContestMap = validContests;
                            let newContestKeys = Object.keys(newContests);

                            for (let key of newContestKeys) {
                                if (totalContests[key] === undefined && !newContests[key].isOver()) totalContests[key] = newContests[key];
                            }

                            let totalContestItems: object = {
                                [Constant.StorageKey.CONTESTS]: totalContests
                            };

                            Storage.setStorage(Constant.StorageType.LOCAL, totalContestItems, function () { });
                        });
                    } else {
                        console.log(this.status);
                    }
                };

                xhr.open('GET', Constant.ProxyUrl + judgeItem.url);
                xhr.send();
            }
        })
    }
}

export default Crawler;