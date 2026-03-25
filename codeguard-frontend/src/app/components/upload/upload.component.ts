import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar Navigation -->
      <aside class="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div class="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-6">
            <h1 class="text-2xl font-bold text-blue-600">CodeGuard AI</h1>
          </div>
          <nav class="mt-8 flex-1 px-4 space-y-2 text-sm font-medium">
            <a routerLink="/dashboard" routerLinkActive="bg-blue-50 text-blue-700" [routerLinkActiveOptions]="{exact: true}" class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md">
              <svg class="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Dashboard
            </a>
            <a routerLink="/upload" routerLinkActive="bg-blue-50 text-blue-700" class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md">
              <svg class="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"/>
              </svg>
              Upload Code
            </a>
            <a routerLink="/results" routerLinkActive="bg-blue-50 text-blue-700" class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md">
              <svg class="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Results
            </a>
          </nav>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto w-full">
        <!-- Mobile Header -->
        <div class="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
          <h1 class="text-xl font-bold text-blue-600">CodeGuard AI</h1>
          <button (click)="logout()" class="text-sm text-gray-600">Logout</button>
        </div>
        
        <div class="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold text-gray-900">Upload Code for Analysis</h2>
            <p class="mt-1 text-sm text-gray-500">Provide the source code you'd like to analyze by pasting or uploading a file.</p>
          </div>

          <div class="bg-white shadow-sm rounded-xl border border-gray-100">
            <div class="px-4 py-5 sm:p-6">
              
              <!-- Tabs -->
              <div class="border-b border-gray-200 mb-6 font-medium">
                <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                  <button (click)="uploadMethod = 'paste'" [class.border-blue-600]="uploadMethod === 'paste'" [class.text-blue-600]="uploadMethod === 'paste'" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 text-sm transition-colors">
                    Paste Code
                  </button>
                  <button (click)="uploadMethod = 'file'" [class.border-blue-600]="uploadMethod === 'file'" [class.text-blue-600]="uploadMethod === 'file'" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 text-sm transition-colors">
                    Upload File
                  </button>
                </nav>
              </div>

              <!-- Paste Code Section -->
              <div *ngIf="uploadMethod === 'paste'" class="space-y-4">
                <div>
                  <label for="code" class="block text-sm font-medium text-gray-700 mb-2">Source Code</label>
                  <textarea id="code" name="code" rows="14" [(ngModel)]="codeContent"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg font-mono p-4 border bg-gray-50/50"
                            placeholder="function validateUser(input) {&#10;  // Your code here&#10;  eval(input);&#10;}"></textarea>
                </div>
              </div>

              <!-- File Upload Section -->
              <div *ngIf="uploadMethod === 'file'" class="space-y-4">
                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                    </svg>
                    <div class="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                      <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" class="sr-only" (change)="onFileSelected($event)" accept=".py,.js,.ts">
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs leading-5 text-gray-500">Python, JS, TS up to 10MB</p>
                  </div>
                </div>
                
                <div *ngIf="selectedFileName" class="text-sm font-medium text-blue-600 flex items-center justify-center mt-4 bg-blue-50 py-2 rounded-md">
                  <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Selected: {{ selectedFileName }}
                </div>
              </div>

              <!-- Action Bar -->
              <div class="mt-8 pt-5 border-t border-gray-200 flex items-center justify-end">
                <button type="button" (click)="submitAnalysis()" [disabled]="isSubmitting || !hasContentToSubmit()"
                        class="inline-flex w-full sm:w-auto justify-center items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all">
                  <svg *ngIf="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSubmitting ? 'Analyzing...' : 'Analyze Code' }}
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class UploadComponent {
  uploadMethod: 'paste' | 'file' = 'paste';
  codeContent: string = '';
  selectedFileName: string | null = null;
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.codeContent = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  }

  hasContentToSubmit(): boolean {
    return this.codeContent.trim().length > 0;
  }

  submitAnalysis() {
    if (!this.hasContentToSubmit()) return;

    this.isSubmitting = true;
    const fileName = this.uploadMethod === 'file' && this.selectedFileName ? this.selectedFileName : 'pasted_code.txt';

    this.apiService.analyze(this.codeContent, fileName)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess('Analysis completed successfully!');
          this.router.navigate(['/results']);
        },
        error: (err) => {
          this.toastService.showError('Analysis failed. Please check the network connection or try again.');
        }
      });
  }

  logout() {
    this.authService.logout();
  }
}
