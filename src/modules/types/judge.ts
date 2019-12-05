class Judge {
    protected _name: string;
    protected _url: string;

    constructor(name: string, url: string) {
        this._name = name;
        this._url = url;
    }

    get name(): string {
        return this._name;
    }

    get url(): string {
        return this._url;
    }
}

export default Judge;