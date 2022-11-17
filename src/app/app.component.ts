import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from './../environments/environment';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService, APP_ACTION } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public name = environment.name;
  public settingsActionId = APP_ACTION.SETTINGS;
  public destroy$ = new Subject<null>();

  public opened: boolean = true;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      takeUntil(this.destroy$),
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private router: Router,
    public appService: AppService

  ) {
    this.iconRegistry.addSvgIcon(this.name, this.sanitizer.bypassSecurityTrustResourceUrl(`../assets/${this.name}.svg`));
    this.iconRegistry.addSvgIcon(this.name + '-text', this.sanitizer.bypassSecurityTrustResourceUrl(`../assets/${this.name}-text.svg`));
  }

  public ngOnInit(): void {
    this.appService.executedAction$
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(val => this.handleAppAction(val))
  }

  public handleAppAction(action: APP_ACTION) {
    switch(action) {
      case APP_ACTION.ADD:
        this.openAddRecipePage();
        break;
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(null);
  }

  public openAboutDialog() {
    this.dialog.open(AboutDialogComponent);
  }

  public openAddRecipePage() {
    this.router.navigate(['/recipes', 'create']);
  }

  public openSettingsPage() {
    this.router.navigate(['settings']);
  }

  public openDocumentationPage() {
    window.open(`https://Famecipe.com`, "_blank");
  }

  public openGithubPage() {
    window.open(`https://github.com/Famecipe`, "_blank");
  }

}
