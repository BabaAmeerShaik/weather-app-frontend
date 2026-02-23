import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth'; 
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleSigninButtonModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit { 
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
    private socialAuthService: SocialAuthService, 
    private http: HttpClient 
  ) {}

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((googleUser) => {
      if (googleUser) {
        console.log('Google gave us a token!', googleUser.idToken);
        
        this.http.post('https://baba-weather-api.azurewebsites.net/api/auth/google-login', { 
          idToken: googleUser.idToken 
        }).subscribe({
          next: (response: any) => {
            console.log('Backend accepted the token!', response);
            // Bulletproof token catch
            const actualToken = response.token || response.Token || response.jwtToken;
            localStorage.setItem('jwtToken', actualToken); 
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
          // Bulletproof token catch
          const actualToken = response.token || response.Token || response.jwtToken;
          console.log('Token:', actualToken);
          localStorage.setItem('jwtToken', actualToken); 
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