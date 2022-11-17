import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, filter, first, takeUntil, take } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import { Recipe, RecipesService } from 'openapi/recipes';
import { Observable, Subject } from 'rxjs';
import { Metadata, MetadataService } from 'openapi/metadata';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit, OnDestroy {

  public pageName: string = '';
  public stack: number = 3;
  private recipes$: Observable<Recipe[]> = this.recipesService.apiRecipesGet();
  private favorites$: Observable<Metadata[]> = this.metadataService.apiMetadataGet();

  public favorites: Metadata[] = [];
  public favoritesMap: { [identifier: string]: boolean } = {};
  public recipes: Recipe[] = [];
  private destroy$ = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private recipesService: RecipesService,
    private metadataService: MetadataService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {

    this.appService.setActionsDisabledState([false, true, true, true, true, true, false]);
    this.appService.setActionsHiddenState([false, true, true, true, true, true, false]);

    let currentRoute = this.router.url;
    switch(currentRoute) {
      case '/recipes':
        this.pageName = 'recipes';
        break;
      case '/favorites':
        this.pageName = 'favorites'
        break;
      case '/recent':
        this.pageName = 'recent';
        break;
    }

    if (this.pageName !== 'recent') {
      this.favorites$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(val => this.handleFavorites(val));
    }
    else {
      this.recipes$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(val => this.handleRecipes(val));
    }
  }

  public getImageUrl(recipe: Recipe) {
    if (recipe.image) {
      return this.document.location.protocol + '//' + this.document.location.hostname + ':58363/api/Images/' + recipe.image;
    }
    return '';
  }

  private handleFavorites(val: Metadata[]) {
    this.favorites = val;

    for (let i = 0; i < this.favorites.length; i++) {
      this.favoritesMap[this.favorites[i].key!] = true;
    }

    this.recipes$
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(val => this.handleRecipes(val));
  }

  private handleRecipes(val: Recipe[]): void {
    switch(this.pageName) {
      case 'recipes':
        this.recipes = val;
        break;
      case 'favorites':        
        for (let i = 0; i < this.favorites.length; i++) {
          let recipe = val.find(item => { return item.identifier == this.favorites[i].key; });
          if (recipe) {
            this.recipes.push(recipe);
          }
        }
        break;
      case 'recent':
        this.recipes = val.filter(x => {
          const then = new Date(x.whenUpdatedUTC!);
          const now = new Date();
          const msBetweenDates = Math.abs(then.getTime() - now.getTime());
          const daysBetweenDates = msBetweenDates / (24 * 60 * 60 * 1000);

          if (daysBetweenDates < 30) {
            return true;
          }
          else {
            return false;
          }
        });
        break;
    }
  }

  public isFavorite(recipe: Recipe) {
    if (this.pageName === 'favorites') {
      return true;
    }
    else {
      return this.favoritesMap[recipe.identifier!];
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }

  public onRecipeTap(recipe: Recipe) {
    if (recipe.identifier) {
      this.router.navigate(['/recipes', recipe.identifier]);
    }
  }
}
