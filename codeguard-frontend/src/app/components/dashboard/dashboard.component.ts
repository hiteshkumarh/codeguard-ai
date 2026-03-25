import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
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
          <div class="px-4 pb-4">
            <button (click)="logout()" class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700">
              Logout
            </button>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto w-full">
        <!-- Mobile Header -->
        <div class="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
          <h1 class="text-xl font-bold text-blue-600">CodeGuard AI</h1>
          <button (click)="logout()" class="text-sm text-gray-600">Logout</button>
        </div>
        
        <div class="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 class="text-2xl font-semibold text-gray-900 mb-6">Overview Dashboard</h1>
          
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Upload Action Card -->
            <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 flex-1 flex flex-col justify-center">
              <div class="px-4 py-8 sm:p-10 text-center">
                <svg class="mx-auto h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h3 class="text-xl leading-6 font-medium text-gray-900">Start new analysis</h3>
                <div class="mt-2 max-w-xl mx-auto text-sm text-gray-500">
                  <p>Upload your python or javascript code for AI-powered security and quality review.</p>
                </div>
                <div class="mt-6">
                  <a routerLink="/upload" class="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    Upload Code
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Recent Activity Card (Mock) -->
            <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 flex-1">
              <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Analyses</h3>
              </div>
              <ul class="divide-y divide-gray-100">
                <li class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" routerLink="/results">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-900">auth_module.py</span>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">2 Critical</span>
                </li>
                <li class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" routerLink="/results">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-900">utils.js</span>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Clean</span>
                </li>
                <li class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" routerLink="/results">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-900">database.py</span>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">1 Medium</span>
                </li>
              </ul>
              <div class="bg-gray-50/50 px-6 py-4 border-t border-gray-100">
                <div class="text-sm">
                  <a routerLink="/results" class="font-medium text-blue-600 hover:text-blue-500 flex items-center">
                    View all results 
                    <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
