import ContestMap from '../types/contestMap';

interface Parser {
    siteName: string;
    parse(html: string): ContestMap;
}

export default Parser;