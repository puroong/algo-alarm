import Parser from './parser';
import TimeFormatter from '../timeFormatter';
import Constant from '../constant';
import Contest from '../types/contest';
import ContestMap from '../types/contestMap';

class CodeParser implements Parser {
    static dateObj: Date = new Date();
    siteName: string;
    consturctor(siteName: string) {
        this.siteName = siteName;
    }

    parse(html: string): ContestMap {
        let domParser: DOMParser = new DOMParser();
        let htmlDoc: Document = domParser.parseFromString(html, 'text/html');

        let contestTable = htmlDoc.querySelector('div.datatable');
        let nodeList = contestTable.querySelectorAll('tr[data-contestid]');
        let contestElemList: HTMLElement[] = [];
        nodeList.forEach(node => contestElemList.push(node as HTMLElement));

        let result: ContestMap = {};
        for (let contestElem of contestElemList) {
            let datas = contestElem.querySelectorAll('td');
            let name: string = datas[0].innerText.trim();
            // cors-anywhere 서버가 북미에 있어서인지 코드포스에서 북미 시간대를 가져옴.
            // 따라서 로컬 타임존 오프셋(CodeParser.dateObj.getTimezoneOffset)이랑 북미 타임존 오프셋(3시간 = 180분)을 서로 뺀 다음에
            // 북미 시간대에 더했음.
            let msTimeZoneOffset: number = (-180 - CodeParser.dateObj.getTimezoneOffset()) * 60 * 1000;
            let beginAt: number = Date.parse(datas[2].innerText.split('UTC')[0]) + msTimeZoneOffset;
            let duration: number = parseInt(datas[3].innerText.split(':')[0]) * 3600000;
            let endAt: number = beginAt + duration;

            result[name] = new Contest(
                Constant.JudgeName.CODEFORCES,
                Constant.JudgeUrl.CODEFORCES,
                name,
                beginAt,
                endAt,
                duration
            );
        }
        return result;
    }
}

export default CodeParser;