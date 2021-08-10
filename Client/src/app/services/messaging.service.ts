import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IChat, IMessage } from '../data-models/signal-r.types';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private http: HttpClient) { }

  createGroup(): Observable<IChat> {
    const requestUrl = `${environment.baseUrl}/api/CreateGroup`;
    return this.http.post<IChat>(requestUrl, {});
  }

  send(message: IMessage): Observable<void> {
    const requestUrl = `${environment.baseUrl}/api/PostMessage/${message.chatName}`;
    return this.http.post<void>(requestUrl, message);
  }

  checkGroupExists(chatName: string): Observable<boolean> {
    const requestUrl = `${environment.baseUrl}/api/ChatExists/${chatName}`;
    return this.http.get<boolean>(requestUrl);
  }

  getPastMessages(chatName: string, earliestTimeStamp: number | undefined ): Observable<IMessage[]> {
    let requestUrl = `${environment.baseUrl}/api/GetMessages/${chatName}`;
    if (earliestTimeStamp) {
      requestUrl += `?timeStamp=${earliestTimeStamp}`;
    }
    return this.http.get<IMessage[]>(requestUrl);
  }

  /*fillRecentChats(chats: string[]): Observable<Map<string, IMessage>> {
    //return this.http.get<Map<string, IMessage>>(requestUrl);
  };*/
}
