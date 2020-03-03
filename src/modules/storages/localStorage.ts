import Storage from './storage';

class LocalStorage implements Storage {
    getItemsByKeysAndRunCallback(keys: string[], cb: (obj: any) => void): void {
        chrome.storage.local.get(keys, cb)
    }

    setItemsAndRunCallback(items: any, cb: () => void): void {
        chrome.storage.local.set(items, cb);
    }
}

export default LocalStorage;