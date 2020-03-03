interface Storage {
    getItemsByKeysAndRunCallback(keys: string[], cb: (obj: any) => void): void
    setItemsAndRunCallback(items: any, cb: () => void): void
}

export default Storage;