import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http'; // <-- Import HttpClient for the Google backend call
import { AuthService } from '../../services/auth'; 
// --- NEW GOOGLE IMPORTS ---
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  // Add GoogleSigninButtonModule here so the HTML tag renders!
  imports: [CommonModule, FormsModule, GoogleSigninButtonModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit { // <-- Implement OnInit
  isLoginMode = true; 
  message = '';       

  user = {
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router,
    private socialAuthService: SocialAuthService, // <-- Inject Google Login Service
    private http: HttpClient // <-- Inject HttpClient
  ) {}

  ngOnInit(): void {
    // This listens for the moment the Google popup closes and returns a token
    this.socialAuthService.authState.subscribe((googleUser) => {
      if (googleUser) {
        console.log('Google gave us a token!', googleUser.idToken);
        
        // Send the token to your .NET Backend
        this.http.post('http://localhost:5223/api/auth/google-login', { 
          idToken: googleUser.idToken 
        }).subscribe({
          next: (response: any) => {
            console.log('Backend accepted the token!', response);
            // Save your API's custom JWT
            localStorage.setItem('token', response.token); 
            // Redirect to the weather map
            this.router.navigate(['/weather']);
          },
          error: (err: any) => {
            this.message = 'Google login failed on the server.';
            console.error(err);
          }
        });
      }
    });
  }

  onToggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.message = ''; 
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.authService.login({ email: this.user.email, password: this.user.password }).subscribe({
        next: (response: any) => {
          console.log('Token:', response.token);
          // Don't forget to save the token for normal logins too!
          localStorage.setItem('token', response.token); 
          this.router.navigate(['/weather']); 
        },
        error: (err: any) => {
          this.message = 'Login failed. Please check your credentials.';
          console.error(err);
        }
      });
    } else {
      this.authService.register(this.user).subscribe({
        next: (response: any) => {
          this.message = 'Registration successful! You can now log in.';
          this.isLoginMode = true; 
        },
        error: (err: any) => {
          this.message = 'Registration failed. User might already exist.';
          console.error(err);
        }
      });
    }
  }
}