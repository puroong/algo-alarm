import Judge from "./Judge";
import Crawler from "../crawlers/crawler";
import JudgeInfo from "../dtos/judgeInfo";
import Parser from "../parsers/parser";
import AcmParser from "../parsers/acmParser";
import AcmCrawler from "../crawlers/acmCrawler";

class AcmJudge extends Judge {
    info: JudgeInfo = new JudgeInfo("acmicpc", "https://www.acmicpc.net/contest/official/list");
    crawler: Crawler = new AcmCrawler();
    parser: Parser = new AcmParser(this.info);
}

export default AcmJudge;