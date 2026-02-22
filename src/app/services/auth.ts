import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Point this to your .NET backend URL
  private apiUrl = 'https://baba-weather-api.azurewebsites.net/api';

  constructor(private http: HttpClient) { }

  // --- FIXED: Added /auth to the path ---
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // --- FIXED: Added /auth to the path ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
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