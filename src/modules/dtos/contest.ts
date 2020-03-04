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

    clone(): Contest {
        return new Contest(
            this.siteName,
            this.siteUrl,
            this.name,
            this.beginAt,
            this.endAt,
            this.duration
        );
    }

    isOver(): boolean {
        return this.endAt - Date.now() < 0;
    }

    isOnGoing(): boolean {
        return this.beginAt - Date.now() < 0 && this.endAt - Date.now() > 0;
    }

    isComing(): boolean {
        return this.beginAt - Date.now() > 0;
    }
}

export default Contest;