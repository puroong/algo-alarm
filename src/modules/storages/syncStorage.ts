import Storage from './storage';

class SyncStorage implements Storage {
    get(keys: string[]): Promise<any> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(keys, function(items) {
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
            chrome.storage.sync.set(items, function() {
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

export default SyncStorage;