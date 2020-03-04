import ContestMap from '../dtos/contestMap';

interface Parser {
    parse(html: string): ContestMap;
}

export default Parser;