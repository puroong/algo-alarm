import Crawler from "./crawler";
import JudgeInfo from "../dtos/judgeInfo";
import ProxyRequests from "../utils/proxyRequests";

class CodeForceCrawler implements Crawler {
    async crawlPage(info: JudgeInfo): Promise<string> {
        const proxyRequests = new ProxyRequests();
        const page: string = await proxyRequests.get(info.url);
        return page;
    }
}

export default CodeForceCrawler;