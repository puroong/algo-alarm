import BackgroundScriptRunner from './modules/backgroundScriptRunner';
import LocalStorage from './modules/storages/localStorage';

const storage = new LocalStorage();
const backgroundScriptRunner = new BackgroundScriptRunner(storage)
backgroundScriptRunner.run()