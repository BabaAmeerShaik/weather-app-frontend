import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather';
import * as L from 'leaflet';

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
  private map: any = null;

  constructor(private weatherService: WeatherService) {}

  search() {
    if (!this.city) return;
    this.errorMessage = '';
    
    this.weatherService.getWeather(this.city).subscribe({
      next: (data: any) => {
        this.weatherData = data;
        
        // Wait 200ms to guarantee Angular has fully rendered the *ngIf HTML
        setTimeout(() => {
          this.updateMap(data.latitude, data.longitude);
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
    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
      console.error('Map div not found in HTML!');
      return;
    }

    // 1. If the map already exists, just move the camera and wake it up
    if (this.map) {
      this.map.setView([lat, lon], 12);
      this.map.invalidateSize(); // Wakes up the map tiles
    } 
    // 2. If it's the first time searching, build the map
    else {
      this.map = L.map('map').setView([lat, lon], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Give Leaflet an extra split second to download the images, then force a redraw
      setTimeout(() => {
        this.map.invalidateSize(); 
      }, 300);
    }

    // Draw a blue circle over the city
    L.circleMarker([lat, lon], {
      color: 'blue',
      fillColor: '#30f',
      fillOpacity: 0.5,
      radius: 10
    }).addTo(this.map);
  }
}