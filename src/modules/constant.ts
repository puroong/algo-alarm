const StorageKey = {
    JUDGES: 'judges',
    CONTESTS: 'contests',
    BADGECOLOR: 'badgeColor'
}
enum MessageType {
    RENDERCONTESTS = 'renderContests',
    UPDATETIME = 'updateTime',
    SETTIMEINTERVAL = 'setInterval',
    UNSETTIMEINTERVAL = 'unsetInterval'
}
enum JudgeName {
    ACMICPC = 'acmicpc',
    CODEFORCES = 'codeforces'
}
enum JudgeUrl {
    ACMICPC = 'https://www.acmicpc.net/contest/official/list',
    CODEFORCES = 'https://codeforces.com/contests'
}
const ProxyUrl = 'https://x434f5253.herokuapp.com/';

export default {
    StorageKey,
    JudgeName,
    JudgeUrl,
    MessageType,
	ProxyUrl
};