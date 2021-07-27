export interface ISignalRConnectionInfo {
    url: string;
    accessToken: string;
}

export interface IMessage {
    Body: string;
    Name: string;
    GroupName: string;
}