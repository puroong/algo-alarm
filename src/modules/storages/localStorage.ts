import Storage from './storage';

class LocalStorage implements Storage {
    get(keys: string[]): Promise<any> {
        return new Promise(function (resolve, reject) {
            chrome.storage.local.get(keys, function(items) {
                if(chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    reject(chrome.runtime.lastError.message);
                } else {
                    resolve(items)
                }
            })
        });
    }

    set(items: any): Promise<void> {
        return new Promise(function (resolve, reject) {
            chrome.storage.local.set(items, function() {
                if(chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    reject(chrome.runtime.lastError.message);
                } else {
                    resolve()
                }
            })
        });
    }
}

export default LocalStorage;