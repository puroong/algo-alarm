class IntervalQueue {
    private queue: Array<number> = [];

    push(id: number) {
        this.queue.push(id);
    }

    clear() {
        while(!this.isEmpty()) {
            clearInterval(this.queue.pop());
        }
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}

export default IntervalQueue;