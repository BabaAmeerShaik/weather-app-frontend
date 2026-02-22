import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:5223/api/weather';

  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any> {
    // 1. Grab the VIP Pass from the browser's memory
    const token = localStorage.getItem('jwtToken');
    
    // 2. Attach it to the HTTP Headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 3. Make the secure request to the C# API
    return this.http.get(`${this.apiUrl}/${city}`, { headers });
  }
}