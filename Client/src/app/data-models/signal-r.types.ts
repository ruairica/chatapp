export interface ISignalRConnectionInfo {
    url: string;
    accessToken: string;
}

export interface IMessage {
    Body: string;
    NickName: string;
    ChatName?: string;
}