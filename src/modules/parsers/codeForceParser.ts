import Parser from './parser';
import TimeFormatter from '../utils/timeFormatter';
import Contest from '../dtos/contest';
import ContestMap from '../dtos/contestMap';
import JudgeInfo from "../dtos/judgeInfo";

class CodeForceParser implements Parser {
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
        const contestTableElement = htmlDocument.querySelector('div.datatable');

        const elements = contestTableElement.querySelectorAll('tr[data-contestid]');
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
            let duration: number = this.parseDuration(dataElements);
            let endAt: number = beginAt + duration;

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
        return dataElements[0].innerText.trim();
    }

    private parseBeginAt(dataElements: NodeListOf<HTMLElementTagNameMap["td"]>): number {
        const msTimeZoneOffset: number = (-180 - new Date().getTimezoneOffset()) * 60 * 1000;
        return Date.parse(dataElements[2].innerText.split('UTC')[0]) + msTimeZoneOffset;
    }

    private parseEndAt(dataElements: NodeListOf<HTMLElementTagNameMap["td"]>): number {
        return Date.parse(TimeFormatter.acmFmt2Iso(dataElements[4].innerText));
    }

    private parseDuration(dataElements: NodeListOf<HTMLElementTagNameMap["td"]>) {
        return parseInt(dataElements[3].innerText.split(':')[0]) * 3600000;
    }
}

export default CodeForceParser;