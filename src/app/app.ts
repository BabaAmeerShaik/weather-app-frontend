import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- Import this

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <-- Use it here
  templateUrl: './app.html', 
})
export class App { 
  title = 'WeatherApp.UI';
}