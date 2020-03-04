import ContestMap from "../dtos/contestMap";
import JudgeInfo from "../dtos/judgeInfo";
import Parser from "../parsers/parser";
import Crawler from "../crawlers/crawler";

abstract class Judge {
    abstract info: JudgeInfo;
    abstract crawler: Crawler;
    abstract parser: Parser;

    async getContests(): Promise<ContestMap> {
        const html = await this.crawler.crawlPage(this.info);
        const contests = this.parser.parse(html);
        return contests;
    }
}

export default Judge;