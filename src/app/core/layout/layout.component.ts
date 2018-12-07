import {ChangeDetectionStrategy, Component, ElementRef, OnInit, OnDestroy, ViewChild, HostBinding} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';

import {NGXLogger} from 'ngx-logger';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, startWith, takeUntil, filter, tap} from 'rxjs/operators';

@Component({
  selector: 'cai-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit, OnDestroy
{
  public readonly isHandset$: Observable<BreakpointState>;

  private _isXSmall$: Observable<BreakpointState>;

  private _onDestroyed: Subject<any>;

  private _subscribed: Subscription;

  public navbarMargin: { height: number };

  @HostBinding('class.root-layout-container')
  public readonly rootLayoutContainer = true;

  constructor(private breakpointObserver: BreakpointObserver, private logger: NGXLogger)
  {
    this.logger.info('Layout constructor');
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        filter(x => x !== null),
        startWith({ matches: true, breakpoints: {} }));
    this._isXSmall$ = this.breakpointObserver.observe(Breakpoints.XSmall)
      .pipe(
        filter(x => x !== null));
    this._onDestroyed = new Subject<any>();

    // this._validateNavMargin();
    this.navbarMargin = {height: 100};

    this.isHandset$.subscribe((value) => { console.log(value); });
  }

  @ViewChild('sidenavToolbar', {read: ElementRef}) private _sidenavToolbar: ElementRef<any>;

  @ViewChild('contentToolbar', {read: ElementRef}) private _contentToolbar: ElementRef<any>;

  public clickMe(): void
  {
    this.logger.info('Click-ity clack: ', this);
  }

  public ngOnInit(): void
  {
    this._subscribed = this._isXSmall$.pipe(
      tap((value: any) => { this.logger.info('Pre-Take', value); }),
      takeUntil(this._onDestroyed),
      startWith(null),
      debounceTime(10),
      tap((value: any) => { this.logger.info('Post-Start', value); })
    )
      .subscribe((value: any) => {
        this.logger.info('Trigger: ', value);
        this._validateNavMargin();
      }, (error: any) => {
        this.logger.error(error);
      }, () => {
        this.logger.error('Completed');
      });
  }

  public ngOnDestroy(): void
  {
    this._onDestroyed.next(null);
    this._onDestroyed.complete();
  }

  private _validateNavMargin()
  {
    // const currentHeight =
    //
    // if (!this.navbarMargin || this.navbarMargin.height !== currentHeight) {
      this.navbarMargin = {
        height: this._toolbarHeight
      };
    // }
  }

  get _toolbarHeight()
  {
    return this._contentBarHeight || this._sidenavBarHeight || 0;
  }

  get _sidenavBarHeight()
  {
    return this._sidenavToolbar.nativeElement ? (
      this._sidenavToolbar.nativeElement.offsetHeight || 0
    ) : 0;
  }

  get _contentBarHeight()
  {
    return this._contentToolbar.nativeElement ? (
      this._contentToolbar.nativeElement.offsetHeight || 0
    ) : 0;
  }
}
