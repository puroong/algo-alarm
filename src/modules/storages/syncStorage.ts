import Storage from './storage';

class SyncStorage implements Storage {
    getItemsByKeysAndRunCallback(keys: string[], cb: (obj: any) => void): void {
        chrome.storage.sync.get(keys, cb);
    }    
    setItemsAndRunCallback(items: any, cb: () => void): void {
        chrome.storage.sync.set(items, cb);
    }
}

export default SyncStorage;