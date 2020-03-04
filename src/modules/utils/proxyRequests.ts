class ProxyRequests {
    private proxyUrl = 'https://x434f5253.herokuapp.com/';

    get(url: string) {
        return new Promise<string>((resolve, reject) => {
            const callback = function () {
                if(this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        error: xhr.statusText
                    });
                }
            };

            const xhr = this.createXhrHttpRequest('GET', url, callback);
            xhr.send();
        })
    }

    private createXhrHttpRequest(method: string, url: string, callback: () => void) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.toProxyUrl(url));
        xhr.onload = callback;
        return xhr;
    }
    private toProxyUrl(url: string): string {
        return `${this.proxyUrl}${url}`
    }
}

export default ProxyRequests;