import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://baba-weather-api.azurewebsites.net/api';

  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any> {
    // 1. Grab the VIP Pass from the browser's memory
    const token = localStorage.getItem('jwtToken');
    
    // 2. Attach it to the HTTP Headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // --- FIXED: Added /weather to the path ---
    return this.http.get(`${this.apiUrl}/weather/${city}`, { headers });
  }
}