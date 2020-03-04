interface Storage {
    get(keys: string[]): Promise<any>
    set(items: any): Promise<void>
}

export default Storage;