import BackgroundScriptRunner from './modules/backgroundScriptRunner';
import JudgeLocalStorage from "./modules/storages/judgeLocalStorage";
import CodeForceJudge from "./modules/judges/CodeForceJudge";
import AcmJudge from "./modules/judges/AcmJudge";

const storage = new JudgeLocalStorage();
const judges = [new AcmJudge(), new CodeForceJudge()];
const backgroundScriptRunner = new BackgroundScriptRunner(storage, judges);
backgroundScriptRunner.run();