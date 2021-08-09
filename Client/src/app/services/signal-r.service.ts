import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { IMessage, ISignalRConnectionInfo } from '../data-models/signal-r.types';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class SignalRService {

    private hubConnection: HubConnection;
    messages: Subject<IMessage> = new Subject();
    httpOptions = {};

    constructor(private http: HttpClient) {

    }

    private getConnectionInfo(groupName: string): Observable<ISignalRConnectionInfo> {
        const requestUrl = `${environment.baseUrl}/api/negotiate`;

        return this.http.get<ISignalRConnectionInfo>(requestUrl, this.httpOptions);
    }

    init(groupName: string) {

        this.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'x-ms-signalr-group': groupName
            })
          };

        this.getConnectionInfo(groupName).subscribe(info => {

            const options = {
                accessTokenFactory: () => info.accessToken
            };

            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(info.url, options)
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.hubConnection.start().catch(err => console.error(err.toString()));

            this.hubConnection.on('newMessage', (data: any) => {
                this.messages.next(data);
            });
        });
    }
}
