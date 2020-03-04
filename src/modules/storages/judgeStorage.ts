import Storage from './storage';
import ContestMap from "../dtos/contestMap";
import JudgePort from "../judgePort";

abstract class JudgeStorage {
    static KEY = {
        CONTESTS: 'contests',
        BADGECOLOR: 'badgeColor'
    };

    abstract storage: Storage;

    abstract getContests(): Promise<ContestMap>;
    abstract setContests(contests: ContestMap): Promise<void>;
    abstract getBadgeColor(): Promise<string>;
    abstract setBadgeColor(badgeColor: string): Promise<void>;

    abstract setStorageOnChangedListener(port: JudgePort): void;
}

export default JudgeStorage;