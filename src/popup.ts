import PopupScriptRunner from "./modules/popupScriptRunner";
import JudgeLocalStorage from "./modules/storages/judgeLocalStorage";

const storage = new JudgeLocalStorage();
const popupScriptRunner = new PopupScriptRunner(storage);
popupScriptRunner.run();