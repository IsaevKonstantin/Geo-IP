import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGeolocation } from '../models/geolocation.model';
import { IpModel } from '../models/ip.model';

@Injectable()
export class ApiService {
    constructor(
        private _http: HttpClient
    ) {
    }

    public getGeolocationByIP(ip: string): Observable<IGeolocation> {
        return this._http.get<IGeolocation>(`http://ip-api.com/json/${ip}`);
    }
 
    public getIp(): Observable<IpModel> {
        return this._http.get<IpModel>('https://geolocation-db.com/json/')
      }
}