import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

let gtag: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  private useGA(): boolean {
    return typeof gtag !== undefined;
  }

  sendPageView(url: string): void {
    if (!this.useGA()) { return; }
    if (!url.startsWith('/')) { url = `/${url}`; }
    gtag('config', environment.analytics.id, {
      'page_path': url
    });
  }

}
