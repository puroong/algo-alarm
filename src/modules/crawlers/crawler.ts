import JudgeInfo from "../dtos/judgeInfo";

interface Crawler {
    crawlPage(info: JudgeInfo): Promise<string>;
}

export default Crawler;