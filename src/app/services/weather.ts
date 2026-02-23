import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://baba-weather-api.azurewebsites.net/api/weather'; 

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    
    // This log will prove if the token is missing!
    console.log('Attaching Token to Request:', token); 

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(`${this.apiUrl}/${city}`, { headers: headers });
  }
}