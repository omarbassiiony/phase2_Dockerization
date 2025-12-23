import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignUp() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      alert('You must fill all fields');
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (this.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    this.isLoading = true;
    
    const userData = {
      username: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.signup(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          console.log('Signup successful:', response);
          alert('Sign Up successful! Please login.');
          
          this.router.navigate(['/login']);
        } else {
          alert('Sign up failed: ' + response.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Signup error:', error);
        
        if (error.error && error.error.message) {
          alert('Sign up failed: ' + error.error.message);
        } else {
          alert('Sign up failed. Please check your connection and try again.');
        }
      }
    });
  }
}