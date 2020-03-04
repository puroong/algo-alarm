import Parser from './parser';
import TimeFormatter from '../utils/timeFormatter';
import Contest from '../dtos/contest';
import ContestMap from '../dtos/contestMap';
import JudgeInfo from "../dtos/judgeInfo";

class AcmParser implements Parser {
    private domParser = new DOMParser();
    private judgeInfo: JudgeInfo;

    constructor(judgeInfo: JudgeInfo) {
        this.judgeInfo = judgeInfo;
    }

    parse(html: string): ContestMap {
        const htmlDocument = this.toHtmlDocument(html);
        const contests = this.parseContests(htmlDocument);
        return contests;
    }

    private toHtmlDocument(html: string) {
        return this.domParser.parseFromString(html, 'text/html');
    }

    private parseContests(htmlDocument: Document): ContestMap {
        const contestElements = this.getContestElements(htmlDocument);
        const contests = this.getContestsFromElements(contestElements);
        return contests;
    }

    private getContestElements(htmlDocument: Document): Array<HTMLElement> {
        const elements = htmlDocument.querySelectorAll('tr.info, tr.success');
        const contestElements: Array<HTMLElement> = [];

        elements.forEach(element => contestElements.push(element as HTMLElement));
        return contestElements;
    }

    private getContestsFromElements(contestElements: Array<HTMLElement>): ContestMap {
        let contests: ContestMap = {};

        for (let contestElement of contestElements) {
            let dataElements = this.getDataElements(contestElement);
            let name: string = this.parseName(dataElements);
            let beginAt: number = this.parseBeginAt(dataElements);
            let endAt: number = this.parseEndAt(dataElements);
            let duration: number = endAt - beginAt;

            contests[name] = new Contest(
                this.judgeInfo.name,
                this.judgeInfo.url,
                name,
                beginAt,
                endAt,
                duration
            );
        }

        return contests;
    }

    private getDataElements(contestElements: HTMLElement): NodeListOf<HTMLElementTagNameMap['td']> {
        return contestElements.querySelectorAll('td');
    }

    private parseName(dataElements: NodeListOf<HTMLElementTagNameMap['td']>): string {
        return dataElements[0].querySelector('a').innerText.trim();
    }

    private parseBeginAt(dataElements: NodeListOf<HTMLElementTagNameMap["td"]>): number {
        return Date.parse(TimeFormatter.acmFmt2Iso(dataElements[3].innerText));
    }

    private parseEndAt(dataElements: NodeListOf<HTMLElementTagNameMap["td"]>): number {
        return Date.parse(TimeFormatter.acmFmt2Iso(dataElements[4].innerText));
    }
}

export default AcmParser;