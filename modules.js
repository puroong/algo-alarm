const CONSTANTS = (function () {
    const TYPELOCAL = 0;
    const TYPESYNC = 1;
    const JUDGES = 'judges';
    const CONTESTS = 'contests';
    const BADGECOLOR = 'badgeColor';
    const PROXYURL = 'https://x434f5253.herokuapp.com/';

    return {
        TYPELOCAL,
        TYPESYNC,
        JUDGES,
        CONTESTS,
        BADGECOLOR,
        PROXYURL
    };
})();

const STORAGE = (function () {
    return {
        getStorage: function (type, keys, cb) {
            if (type === CONSTANTS.TYPELOCAL) {
                chrome.storage.local.get(keys, cb);
            } else if (type === CONSTANTS.TYPESYNC) {
                chrome.storage.sync.get(keys, cb);
            } else {
                throw Error("Invalid Storage Type");
            }
        },
        setStorage: function (type, items, cb) {
            if (type === CONSTANTS.TYPELOCAL) {
                chrome.storage.local.set(items, cb);
            } else if (type === CONSTANTS.TYPESYNC) {
                chrome.storage.sync.set(items, cb);
            } else {
                throw Error("Invalid Storage Type");
            }
        }
    }
})();

const TIMEFORMATTER = (function () {
    return {
        beginAt2Readable: function (msTime) {
            let date = new Date(msTime);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            let hour = date.getHours();
            let minute = date.getMinutes();
            let second = date.getSeconds();

            let fmt = `시작일자: ${year}년 ${month}월 ${day}일 `;
            if (hour) fmt += `${hour}시 `;
            if (minute) fmt += `${minute}분 `;
            if (second) fmt += `${second}초`;

            return fmt;
        },
        until2Readable: function (msTime) {
            let sTime = Math.floor(msTime / 1000);

            let day = Math.floor(sTime / 86400);
            let hour = Math.floor((sTime - day * 86400) / 3600);
            let minute = Math.floor((sTime - day * 86400 - hour * 3600) / 60);
            let second = Math.floor((sTime - day * 86400 - hour * 3600 - minute * 60));

            let fmt = '남은시간: ';
            if (day != 0) fmt += `${day}일 `;
            if (hour != 0) fmt += `${hour}시간 `;
            if (minute != 0) fmt += `${minute}분 `;
            if (second != 0) fmt += `${second}초 `;

            return fmt;
        },
        duration2Readable: function (msTime) {
            let sTime = Math.floor(msTime / 1000);

            let day = Math.floor(sTime / 86400);
            let hour = Math.floor((sTime - day * 86400) / 3600);
            let minute = Math.floor((sTime - day * 86400 - hour * 3600) / 60);
            let second = Math.floor((sTime - day * 86400 - hour * 3600 - minute * 60));

            let fmt = '';
            if (day != 0) fmt += `${day}일 `;
            if (hour != 0) fmt += `${hour}시간 `;
            if (minute != 0) fmt += `${minute}분 `;
            if (second != 0) fmt += `${second}초 `;

            return fmt;
        },
        acmFmt2Iso: function (acmFmt) {
            let dateItems = acmFmt.split(" ");

            let year = undefined;
            let month = undefined;
            let day = undefined;
            let hour = undefined;
            let minute = undefined;
            let second = undefined;

            if (dateItems[0]) year = dateItems[0].split("년")[0];
            if (dateItems[1]) month = dateItems[1].split("월")[0];
            if (dateItems[2]) day = dateItems[2].split("일")[0];
            if (dateItems[3]) hour = dateItems[3].split("시")[0];
            if (dateItems[4]) minute = dateItems[4].split("분")[0];
            if (dateItems[5]) second = dateItems[5].split("초")[0];

            let isoFmt;
            if (second) isoFmt = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            if (minute) isoFmt = `${year}-${month}-${day} ${hour}:${minute}:00`;
            if (hour) isoFmt = `${year}-${month}-${day} ${hour}:00:00`;

            return isoFmt;
        }
    }
})();

const PARSER = (function () {
    const parser = {
        'acmicpc': function (html) {
            let domParser = new DOMParser();
            let htmlDoc = domParser.parseFromString(html, 'text/html');

            let nodeList = htmlDoc.querySelectorAll('tr.info,tr.success');
            let contestList = [];

            for (let nodeItem of nodeList) {
                contestList.push(nodeItem);
            }

            let result = {};
            for (let contestItem of contestList) {
                let datas = contestItem.querySelectorAll('td');
                let name = datas[0].querySelector('a').innerText.trim();
                let beginAt = new Date(TIMEFORMATTER.acmFmt2Iso(datas[3].innerText)).getTime();
                let endAt = new Date(TIMEFORMATTER.acmFmt2Iso(datas[4].innerText)).getTime();
                let duration = endAt - beginAt;

                result[name] = CONTEST.createContest({
                    siteName: 'acmicpc',
                    siteUrl: 'https://www.acmicpc.net/contest/official/list',
                    name: name,
                    beginAt: beginAt,
                    endAt: endAt,
                    duration: duration
                });
            }

            return result;
        },
        'codeforces': function (html) {
            let domParser = new DOMParser();
            let htmlDoc = domParser.parseFromString(html, 'text/html');

            let contestTable = htmlDoc.querySelector('div.datatable');
            let nodeList = contestTable.querySelectorAll('tr[data-contestid]');

            let result = {};
            for (let nodeItem of nodeList) {
                let datas = nodeItem.querySelectorAll('td');
                let name = datas[0].innerText.trim();
                // cors-anywhere 서버가 북미에 있어서인지 코드포스에서 북미 시간대를 가져옴.
                // 따라서 로컬 타임존 오프셋(new Date().getTimezoneOffset)이랑 북미 타임존 오프셋(3시간 = 180분)을 서로 뺀 다음에
                // 북미 시간대에 더했음.
                let msTimeZoneOffset = (-180 - new Date().getTimezoneOffset()) * 60 * 1000;
                let beginAt = new Date(datas[2].innerText.split('UTC')[0]).getTime() + msTimeZoneOffset;
                let duration = parseInt(datas[3].innerText.split(':')[0]) * 3600000;
                let endAt = beginAt + duration;

                result[name] = CONTEST.createContest({
                    siteName: 'codeforces',
                    siteUrl: 'https://codeforces.com/contests',
                    name: name,
                    beginAt: beginAt,
                    endAt: endAt,
                    duration: duration
                });
            }

            return result;
        }
    };

    return {
        parseContest: function (siteName, html) {
            return parser[siteName](html);
        }
    };
})();

const CRAWLER = (function () {
    return {
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
    }
})();

const MESSAGE = (function () {
    let _Message = function (command, data) {
        if (!command || !data) throw new Error('Invaild Arguments');
        this.command = command;
        this.data = data;
    };

    return {
        createMessage: function (obj) {
            const command = obj.command;
            const data = obj.data;

            return new _Message(command, data);
        }
    }
})();

const CONTEST = (function () {
    let _Contest = function (siteName, siteUrl, name, beginAt, endAt, duration) {
        if (!siteName || !siteUrl || !name || !beginAt || !endAt || !duration) throw new Error('Invalid Arguments');
        this.siteName = siteName;
        this.siteUrl = siteUrl;
        this.name = name;
        this.beginAt = beginAt;
        this.endAt = endAt;
        this.duration = duration;
    }

    _Contest.prototype.isOver = function () {
        return this.endAt - new Date().getTime() < 0;
    };

    _Contest.prototype.isStarted = function () {
        return this.beginAt - new Date().getTime() < 0;
    };

    return {
        createContest: function (obj) {
            const siteName = obj.siteName;
            const siteUrl = obj.siteUrl;
            const name = obj.name;
            const beginAt = obj.beginAt;
            const endAt = obj.endAt;
            const duration = obj.duration;

            return new _Contest(siteName, siteUrl, name, beginAt, endAt, duration);
        }
    }
})();