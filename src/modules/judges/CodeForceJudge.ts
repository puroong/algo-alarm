import Judge from "./Judge";
import Crawler from "../crawlers/crawler";
import JudgeInfo from "../dtos/judgeInfo";
import Parser from "../parsers/parser";
import CodeForceCrawler from "../crawlers/codeForceCrawler";
import CodeForceParser from "../parsers/codeForceParser";

class CodeForceJudge extends Judge {
    info: JudgeInfo = new JudgeInfo("codeforce", "https://codeforces.com/contests");
    crawler: Crawler = new CodeForceCrawler();
    parser: Parser = new CodeForceParser(this.info);
}

export default CodeForceJudge;