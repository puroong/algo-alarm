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
            // cors-anywhere ������ �Ϲ̿� �־���� �ڵ��������� �Ϲ� �ð��븦 ������.
            // ���� ���� Ÿ���� ������(new Date().getTimezoneOffset)�̶� �Ϲ� Ÿ���� ������(3�ð� = 180��)�� ���� �� ������
            // �Ϲ� �ð��뿡 ������.
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

export default {
	parseContest: function (siteName, html) {
        return parser[siteName](html);
    }
}