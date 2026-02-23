import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // <-- Needed for logout redirect
import { WeatherService } from '../../services/weather';
import { AuthService } from '../../services/auth'; // <-- Needed to clear the token
import * as L from 'leaflet';

@Component({
  selector: 'app-weather-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather-search.html',
  styleUrl: './weather-search.css'  // <-- THIS IS THE MISSING MAGIC LINE!
})
export class WeatherSearch {
  // ... rest of your code ...
  city: string = '';
  weatherData: any = null;
  errorMessage: string = '';
  private map: any = null;

  constructor(
    private weatherService: WeatherService,
    private authService: AuthService, // <-- Injected auth service
    private router: Router            // <-- Injected router
  ) {}

  search() {
    if (!this.city) return;
    this.errorMessage = '';
    
    this.weatherService.getWeather(this.city).subscribe({
      next: (data: any) => {
        this.weatherData = data;
        
        // Wait 200ms to guarantee Angular has fully rendered the *ngIf HTML
        setTimeout(() => {
          // Used safe traversal in case the API returns lat/lon differently
          this.updateMap(data.latitude || data.coord?.lat, data.longitude || data.coord?.lon);
        }, 200);
      },
      error: (err: any) => {
        this.errorMessage = err.status === 401 ? 'Unauthorized! Please log in first.' : 'City not found or server error.';
        this.weatherData = null;
        console.error(err);
      }
    });
  }

  updateMap(lat: number, lon: number) {
    if (lat === undefined || lon === undefined) return;
    
    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
      console.error('Map div not found in HTML!');
      return;
    }

    if (this.map) {
      this.map.setView([lat, lon], 12);
      this.map.invalidateSize(); 
    } 
    else {
      this.map = L.map('map').setView([lat, lon], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      setTimeout(() => {
        this.map.invalidateSize(); 
      }, 300);
    }

    L.circleMarker([lat, lon], {
      color: 'blue',
      fillColor: '#30f',
      fillOpacity: 0.5,
      radius: 10
    }).addTo(this.map);
  }

  // --- NEW: The missing logout function! ---
  logout() {
    this.authService.logout();        // Clears the JWT token from storage
    this.router.navigate(['/login']); // Sends the user back to the login page
  }
}