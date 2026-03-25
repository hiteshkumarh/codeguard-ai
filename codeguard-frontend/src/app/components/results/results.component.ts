import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

interface Issue {
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  line_number: number;
}

interface ResultData {
  issues: Issue[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar Navigation -->
      <aside class="w-64 bg-white border-r border-gray-200 hidden md:block flex-shrink-0">
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
        
        <div class="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl font-semibold text-gray-900">Analysis Results</h1>
              <p class="mt-1 text-sm text-gray-500">Review the security issues and code quality metrics.</p>
            </div>
            <div>
              <button (click)="loadResults()" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg class="mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-24">
            <svg class="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500 text-sm font-medium">Fetching analysis results...</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!isLoading && (!results || results.issues.length === 0)" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900">No issues found</h3>
            <p class="mt-1 text-sm text-gray-500">Your code looks good, or you haven't run an analysis yet.</p>
            <div class="mt-6">
              <a routerLink="/upload" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Upload New Code
              </a>
            </div>
          </div>

          <div *ngIf="!isLoading && results && results.issues.length > 0">
            <!-- Summary Stats & Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <!-- Severity Dashboard Card -->
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Severity Dashboard</h3>
                <div class="h-64 relative">
                  <canvas #severityChart></canvas>
                </div>
              </div>
              
              <!-- Stats -->
              <div class="grid grid-cols-2 gap-4 lg:col-span-2">
                <div class="bg-white rounded-xl shadow-sm border border-red-200 p-6 border-l-4 border-l-red-500">
                  <dt class="text-sm font-medium text-gray-500 truncate">Critical Issues</dt>
                  <dd class="mt-1 text-3xl font-semibold text-red-700">{{ results.summary.critical }}</dd>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-orange-200 p-6 border-l-4 border-l-orange-500">
                  <dt class="text-sm font-medium text-gray-500 truncate">High Severity</dt>
                  <dd class="mt-1 text-3xl font-semibold text-orange-700">{{ results.summary.high }}</dd>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-yellow-200 p-6 border-l-4 border-l-yellow-400">
                  <dt class="text-sm font-medium text-gray-500 truncate">Medium Severity</dt>
                  <dd class="mt-1 text-3xl font-semibold text-yellow-700">{{ results.summary.medium }}</dd>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-blue-200 p-6 border-l-4 border-l-blue-500">
                  <dt class="text-sm font-medium text-gray-500 truncate">Low Severity</dt>
                  <dd class="mt-1 text-3xl font-semibold text-blue-700">{{ results.summary.low }}</dd>
                </div>
              </div>
            </div>

            <!-- Issues List -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Detected Issues ({{ results.issues.length }})</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let issue of results.issues" class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              [ngClass]="{
                                'bg-red-100 text-red-800 border border-red-200': issue.severity === 'Critical',
                                'bg-orange-100 text-orange-800 border border-orange-200': issue.severity === 'High',
                                'bg-yellow-100 text-yellow-800 border border-yellow-200': issue.severity === 'Medium',
                                'bg-blue-100 text-blue-800 border border-blue-200': issue.severity === 'Low'
                              }">
                          {{ issue.severity }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ issue.type }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {{ issue.line_number }}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500">
                        {{ issue.description }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class ResultsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('severityChart') severityChartRef!: ElementRef;
  
  isLoading = true;
  results: ResultData | null = null;
  chart: Chart | null = null;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadResults();
  }

  ngAfterViewInit() {
    this.initChartIfReady();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadResults() {
    this.isLoading = true;
    this.apiService.getResults().subscribe({
      next: (data) => {
        // Handle variations in backend response shape if it returns { issues: [] } 
        // or just array [] depending on how FastAPI is coded. Assuming { issues: [] }.
        if (Array.isArray(data)) {
          this.results = this.processIssues(data);
        } else if (data && Array.isArray(data.issues)) {
          this.results = this.processIssues(data.issues);
        } else {
          // Fallback if data format is unexpected
          this.results = this.processIssues([]);
        }
        this.isLoading = false;
        setTimeout(() => this.initChartIfReady(), 0);
      },
      error: (err) => {
        this.toastService.showError('Failed to load results.');
        this.isLoading = false;
      }
    });
  }

  processIssues(issuesList: Issue[]): ResultData {
    const summary = { total: 0, critical: 0, high: 0, medium: 0, low: 0 };
    
    issuesList.forEach(issue => {
      summary.total++;
      const rawSev = (issue.severity || '').toString().toLowerCase().trim();
      let normalizedSev: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
      
      if (rawSev === 'critical') {
        summary.critical++;
        normalizedSev = 'Critical';
      } else if (rawSev === 'high') {
        summary.high++;
        normalizedSev = 'High';
      } else if (rawSev === 'low') {
        summary.low++;
        normalizedSev = 'Low';
      } else {
        summary.medium++;
        normalizedSev = 'Medium';
      }
      
      issue.severity = normalizedSev;
    });

    return { issues: issuesList, summary };
  }

  initChartIfReady() {
    if (!this.severityChartRef || !this.results || this.results.issues.length === 0) return;
    
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.severityChartRef.nativeElement.getContext('2d');
    
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          data: [
            this.results.summary.critical,
            this.results.summary.high,
            this.results.summary.medium,
            this.results.summary.low
          ],
          backgroundColor: [
            'rgb(220, 38, 38)',  // red-600
            'rgb(234, 88, 12)',  // orange-600
            'rgb(234, 179, 8)',  // yellow-500
            'rgb(37, 99, 235)'   // blue-600
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  logout() {
    this.authService.logout();
  }
}
