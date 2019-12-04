let Contest = function (siteName, siteUrl, name, beginAt, endAt, duration) {
    if (!siteName || !siteUrl || !name || !beginAt || !endAt || !duration) throw new Error('Invalid Arguments');
    this.siteName = siteName;
    this.siteUrl = siteUrl;
    this.name = name;
    this.beginAt = beginAt;
    this.endAt = endAt;
    this.duration = duration;
}

Contest.prototype.isOver = function () {
	return this.endAt - new Date().getTime() < 0;
}

Contest.prototype.isOnGoing = function () {
	return this.beginAt - new Date().getTime() < 0 && this.endAt - new Date() > 0;
}

Contest.prototype.isComing = function () {
	return this.beginAt - new Date().getTime() > 0;
}

export default {
	createContest: function (obj) {
        const siteName = obj.siteName;
        const siteUrl = obj.siteUrl;
        const name = obj.name;
        const beginAt = obj.beginAt;
        const endAt = obj.endAt;
        const duration = obj.duration;

        return new Contest(siteName, siteUrl, name, beginAt, endAt, duration);
    }
}