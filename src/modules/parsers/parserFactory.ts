import Constant from '../constant';
import Parser from './parser';
import CodeParser from './codeParser';
import AcmParser from './acmParser';

class ParserFactory {
    static createParser(name: string): Parser {
        if (name === Constant.JudgeName.ACMICPC) return new AcmParser();
        else if (name === Constant.JudgeName.CODEFORCES) return new CodeParser();
    }
}

export default ParserFactory;