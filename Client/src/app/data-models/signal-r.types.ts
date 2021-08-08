export interface ISignalRConnectionInfo {
    url: string;
    accessToken: string;
}

export interface IMessage {
    body: string;
    nickName: string;
    chatName?: string;
    messageTime?: Date;
    timeStamp?: number;
}

export interface IChat {
    chatName: string;
}
