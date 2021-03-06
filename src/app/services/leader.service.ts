import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { of, Observable } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeader(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL+ 'leadership')
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeatureLeader(): Observable<Leader>{
    return this.http.get<Leader[]>(baseURL+ 'leadership?featured=true').pipe(map(leadership => leadership[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));
   
  }

}
