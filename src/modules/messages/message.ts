abstract class Message {
    protected command: string;
    protected data: any;

    protected constructor(command: string, data: any) {
        this.command = command;
        this.data = data;
    }
}

export default Message;