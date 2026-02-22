import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather';
import * as L from 'leaflet'; // <-- Import Leaflet

@Component({
  selector: 'app-weather-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather-search.html'
})
export class WeatherSearch {
  city: string = '';
  weatherData: any = null;
  errorMessage: string = '';
  private map: any; // Holds our map instance

  constructor(private weatherService: WeatherService) {}

  search() {
    if (!this.city) return;
    this.errorMessage = '';
    
    this.weatherService.getWeather(this.city).subscribe({
      next: (data: any) => {
        this.weatherData = data;
        
        // When we get the data, wait a tiny fraction of a second for HTML to render, then draw the map
        setTimeout(() => {
          this.updateMap(data.latitude, data.longitude);
        }, 100);
      },
      error: (err: any) => {
        this.errorMessage = err.status === 401 ? 'Unauthorized! Please log in first.' : 'City not found or server error.';
        this.weatherData = null;
        console.error(err);
      }
    });
  }

  updateMap(lat: number, lon: number) {
  // We use requestAnimationFrame to wait for the browser's next paint cycle
  window.requestAnimationFrame(() => {
    setTimeout(() => {
      const mapContainer = document.getElementById('map');
      
      if (!mapContainer) {
        console.error("Map container not found in DOM!");
        return;
      }

      if (!this.map) {
        this.map = L.map('map').setView([lat, lon], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(this.map);
      } else {
        this.map.setView([lat, lon], 12);
      }

      // Force Leaflet to recalculate the container size
      this.map.invalidateSize();
      
      // Clear old markers and add a new one
      L.marker([lat, lon]).addTo(this.map);
    }, 100);
  });
}
}