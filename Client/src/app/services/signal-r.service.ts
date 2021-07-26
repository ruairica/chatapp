import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Message, SignalRConnectionInfo } from "../data-models/signal-r.types";

@Injectable({
    providedIn: 'root'
})

export class SignalRService {

    //private readonly _http: HttpClient;
    private readonly _baseUrl: string = "http://localhost:7071/api/";
    private hubConnection: HubConnection;
    messages: Subject<Message> = new Subject();

    constructor(private http: HttpClient) {

    }

    private getConnectionInfo(): Observable<SignalRConnectionInfo> {
        let requestUrl = `/api/negotiate`;
        return this.http.get<SignalRConnectionInfo>(requestUrl);
        //return this.http.get<boolean>('/api/HelloWorld');
    }

    init() {
        console.log(`initializing SignalRService...`);
        this.getConnectionInfo().subscribe(info => {
            console.log(`received info for endpoint ${info.url} acces totekn: ${info.accessToken}`);
            let options = {
                accessTokenFactory: () => info.accessToken
            };

            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(info.url, options)
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.hubConnection.start().catch(err => console.error(err.toString()));

            this.hubConnection.on('notify', (data: any) => {
                console.log(data);
                this.messages.next(data);
            });
        });
    }

    send(message: string): Observable<void> {
        let requestUrl = `/api/message`;
        return this.http.post(requestUrl, message).pipe(map((result: any) => { }));
    }


    //    send(message: string): string {
    //     let requestUrl = `/api/message`;
    //     return requestUrl;
    //}

    
}
