import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // Your exact Azure backend URL
  private apiUrl = 'https://baba-weather-api.azurewebsites.net/api/weather'; 

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    // 1. Grab the token that was saved during login
    const token = localStorage.getItem('jwtToken');

    // 2. Attach it to the HTTP Headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });

    // 3. Send the request with the headers included!
    return this.http.get(`${this.apiUrl}/${city}`, { headers: headers });
  }
}