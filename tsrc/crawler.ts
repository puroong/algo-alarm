export default {
	getContests: function () {
        STORAGE.getStorage(CONSTANTS.TYPELOCAL, [CONSTANTS.JUDGES], function (obj) {
            const judges = obj[CONSTANTS.JUDGES];

            if (!judges) return;

            let judgeListKeys = Object.keys(judges);
            for (let key of judgeListKeys) {
                let judgeItem = judges[key];

                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        let newContests = PARSER.parseContest(judgeItem.name, this.responseText);

                        STORAGE.getStorage(CONSTANTS.TYPELOCAL, [CONSTANTS.CONTESTS], function (obj) {
                            let today = new Date();

                            let curContests = obj[CONSTANTS.CONTESTS] || {};
                            let curContestsKeys = Object.keys(curContests);
                            curContestsKeys.forEach(k => curContests[k] = CONTEST.createContest(curContests[k]));

                            let validContests = {};

                            for (let key of curContestsKeys) {
                                if (!curContests[key].isOver()) validContests[key] = curContests[key];
                            }

                            let totalContests = JSON.parse(JSON.stringify(validContests));
                            let newContestKeys = Object.keys(newContests);
                            for (let key of newContestKeys) {
                                if (totalContests[key] === undefined && !newContests[key].isOver()) totalContests[key] = newContests[key];
                            }

                            let totalContestItems = {
                                [CONSTANTS.CONTESTS]: totalContests
                            };

                            STORAGE.setStorage(CONSTANTS.TYPELOCAL, totalContestItems, function () {
                            });
                        });
                    } else {
                        console.log(this.statusText);
                    }
                };

                xhr.open('GET', CONSTANTS.PROXYURL + judgeItem.url);
                xhr.send();
            }
        });
    }
};