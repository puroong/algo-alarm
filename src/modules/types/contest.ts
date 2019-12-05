class Contest {
    siteName: string;
    siteUrl: string;
    name: string;
    beginAt: number;
    endAt: number;
    duration: number;

    constructor(siteName: string, siteUrl: string, name: string, beginAt: number, endAt: number, duration: number) {
        this.siteName = siteName;
        this.siteUrl = siteUrl;
        this.name = name;
        this.beginAt = beginAt;
        this.endAt = endAt;
        this.duration = duration;
    }

    isOver(): boolean {
        return this.endAt - new Date().getTime() < 0;
    }

    isOnGoing(): boolean {
        const now = new Date();
        return this.beginAt - now.getTime() < 0 && this.endAt - now.getTime() > 0;
    }

    isComing(): boolean {
        return this.beginAt - new Date().getTime() > 0;
    }
}

export default Contest;