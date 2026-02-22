import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Point this to your .NET backend URL
  private apiUrl = 'https://baba-weather-api.azurewebsites.net';

  constructor(private http: HttpClient) { }

  // Calls the C# Register endpoint
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Calls the C# Login endpoint and saves the token
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          // Save the VIP pass to the browser's Local Storage
          localStorage.setItem('jwtToken', response.token);
        }
      })
    );
  }

  // Retrieves the token when we need to make a weather request
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // Clears the token to log out
  logout(): void {
    localStorage.removeItem('jwtToken');
  }
}