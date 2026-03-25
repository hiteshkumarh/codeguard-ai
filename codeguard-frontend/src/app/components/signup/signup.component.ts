import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
            CodeGuard AI
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Create a new account
          </p>
        </div>
        <form class="mt-8 space-y-6" #signupForm="ngForm" (ngSubmit)="onSubmit(signupForm)">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <input id="email" name="email" type="email" autocomplete="email" required
                     ngModel #email="ngModel"
                     pattern="^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,4}$"
                     class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm mt-1"
                     [ngClass]="{'border-red-300 focus:ring-red-500 focus:border-red-500': email.invalid && (email.dirty || email.touched)}"
                     placeholder="you@example.com">
              <div *ngIf="email.invalid && (email.dirty || email.touched)" class="mt-1 text-sm text-red-600">
                <span *ngIf="email.errors?.['required']">Email is required.</span>
                <span *ngIf="email.errors?.['pattern']">Please enter a valid email.</span>
              </div>
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" required
                     ngModel #password="ngModel" minlength="6"
                     class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm mt-1"
                     [ngClass]="{'border-red-300 focus:ring-red-500 focus:border-red-500': password.invalid && (password.dirty || password.touched)}"
                     placeholder="••••••••">
              <div *ngIf="password.invalid && (password.dirty || password.touched)" class="mt-1 text-sm text-red-600">
                <span *ngIf="password.errors?.['required']">Password is required.</span>
                <span *ngIf="password.errors?.['minlength']">Password must be at least 6 characters.</span>
              </div>
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="signupForm.invalid || isLoading"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3" *ngIf="isLoading">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Creating account...' : 'Sign up' }}
            </button>
          </div>
          
          <div class="text-sm text-center">
            <span class="text-gray-600">Already have an account? </span>
            <a routerLink="/login" class="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class SignupComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    
    this.isLoading = true;
    this.authService.signup(form.value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Account created successfully. Please login.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Signup API Error:', err);
          let msg = 'An unexpected error occurred. Please try again.';
          
          if (err.status === 400) {
            // Usually returns detail: "Email already taken"
            msg = err.error?.detail || 'Invalid input data.';
            if (Array.isArray(msg)) msg = msg[0]?.msg || msg; // Handle FastAPI validation array
          } else if (err.status === 422) {
            msg = 'Validation Error: Check your email and password format.';
          } else if (err.status === 500) {
            msg = 'Server error, try again later.';
          } else if (err.status === 0) {
            msg = 'Network error. The server might be unreachable or CORS is misconfigured.';
          } else if (err.error?.detail) {
            msg = typeof err.error.detail === 'string' ? err.error.detail : 'Signup failed.';
          }
          
          this.toastService.showError(msg);
        }
      });
  }
}
