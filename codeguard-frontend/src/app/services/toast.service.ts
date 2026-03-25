import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast$ = new Subject<Toast>();

  showSuccess(message: string) {
    this.toast$.next({ message, type: 'success' });
  }

  showError(message: string) {
    this.toast$.next({ message, type: 'error' });
  }

  showInfo(message: string) {
    this.toast$.next({ message, type: 'info' });
  }
}
