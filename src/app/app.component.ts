import { Component, OnDestroy, ViewChild,ElementRef } from '@angular/core';
import { Observable, Subject} from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = "HIROM'S BLOG ソフトウェアエンジニアの個人ブログ'";
  @ViewChild('sidenav') 
  sidenav!: MatSidenav;

  private unsubscribe = new Subject();

  isNotLarge$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Large, Breakpoints.XLarge])
    .pipe(
      map(result => !result.matches),
      takeUntil(this.unsubscribe)
    );

  isLarge$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Large, Breakpoints.XLarge])
    .pipe(
      map(result => result.matches),
      takeUntil(this.unsubscribe)
    )

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  listItemClick() {
    if (this.sidenav.mode == 'over' && this.sidenav.opened) {
      this.sidenav.close();
    }
  }
}
