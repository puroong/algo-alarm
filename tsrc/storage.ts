import Constant from './constant';

export default {
	getStorage: function (type, keys, cb) {
		if(type === Constant.Storage.LOCAL) {
			chrome.storage.local.get(keys, cb);
		} else if(type === Constant.Storage.SYNC) {
			chrome.storage.sync.get(keys, cb);
		} else {
			throw new Error('Invalid Storage Type');
		}
	},
	setStorage: function (type, items, cb) {
		if(type === Constant.Storage.LOCAL) {
			chrome.storage.local.set(items, cb);
		} else if(type === Constant.Storage.SYNC) {
			chrome.storage.sync.set(items, cb);
		} else {
			throw new Error('Invalid Storage Type');
		}
	}
};