import Constant from './constant';

class Storage {
    static getStorage(type: number, keys: string[], cb: (obj: any) => void): never;
    static getStorage(type: number, keys: string[], cb: (obj: any) => void): void {
        if (type === Constant.StorageType.LOCAL) {
            chrome.storage.local.get(keys, cb);
        } else if (type === Constant.StorageType.SYNC) {
            chrome.storage.sync.get(keys, cb);
        } else {
            throw new Error('Invalid Storage Type');
        }
    }

    static setStorage(type: number, items: any, cb: () => void): never;
    static setStorage(type: number, items: any, cb: () => void): void {
        if (type === Constant.StorageType.LOCAL) {
            chrome.storage.local.set(items, cb);
        } else if (type === Constant.StorageType.SYNC) {
            chrome.storage.sync.set(items, cb);
        } else {
            throw new Error('Invalid Storage Type');
        }
    }
}

export default Storage;