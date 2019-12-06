import Parser from './parser';
import TimeFormatter from '../timeFormatter';
import Constant from '../constant';
import Contest from '../types/contest';
import ContestMap from '../types/contestMap';

class AcmParser implements Parser {
    siteName: string;
    consturctor(siteName: string) {
        this.siteName = siteName;
    }

    parse(html: string): ContestMap {
        let domParser: DOMParser = new DOMParser();
        let htmlDoc: Document = domParser.parseFromString(html, 'text/html');

        let nodeList = htmlDoc.querySelectorAll('tr.info, tr.success');
        let contestElemList: HTMLElement[] = [];

        nodeList.forEach(node => contestElemList.push(node as HTMLElement));

        let result: ContestMap = {};
        for (let contestElem of contestElemList) {
            let datas = contestElem.querySelectorAll('td');
            let name: string = datas[0].querySelector('a').innerText.trim();
            let beginAt: number = Date.parse(TimeFormatter.acmFmt2Iso(datas[3].innerText));
            let endAt: number = Date.parse(TimeFormatter.acmFmt2Iso(datas[4].innerText));
            let duration: number = endAt - beginAt;

            result[name] = new Contest(
                Constant.JudgeName.ACMICPC,
                Constant.JudgeUrl.ACMICPC,
                name,
                beginAt,
                endAt,
                duration
            );
        }
        return result;
    }
}

export default AcmParser;