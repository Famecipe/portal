import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePickerConf } from 'ngp-image-picker';
import { ImagesService } from 'openapi/images';
import { MetadataService, Metadata } from 'openapi/metadata';
import { Recipe, RecipesService } from 'openapi/recipes';
import { map, Subject, take, takeUntil } from 'rxjs';
import { AppService, APP_ACTION } from '../app.service';
import { DeleteRecipeDialogComponent } from '../delete-recipe-dialog/delete-recipe-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum ITEM_TYPE {
  TAGS = 'tags',
  INGREDIENTS = 'ingredients',
  EQUIPMENT = 'equipment',
  DIRECTIONS = 'directions'
}

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit, OnDestroy {

  public editing: boolean = false;

  public adding: boolean = false;

  public identifier: string | null = null;

  public destroy$ = new Subject<null>();

  public recipe: Recipe = {
    name: '',
    image: '',
    ingredients: [''],
    equipment: [''],
    directions: ['']
  };

  public imagePickerConf: ImagePickerConf = {
    width: '100%',
    height: '400px',
    borderRadius: '2px',
    objectFit: 'contain',
    language: 'en',
    hideDeleteBtn: false,
    hideDownloadBtn: true,
    hideEditBtn: false,
    hideAddBtn: true
  }

  public imageData?: string;

  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private imagesService: ImagesService,
    private metadataService: MetadataService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.route.params
      .pipe(
        map(val => val['identifier']),
        takeUntil(this.destroy$)
      )
      .subscribe(val => this.handleRouteIdentifier(val));

    this.appService.executedAction$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(val => this.handleAppAction(val));
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }

  private handleRouteIdentifier(identifier: string) {
    this.identifier = identifier;
    this.adding = identifier === 'create';
    this.editing = this.adding;

    if (!this.adding) {

      this.appService.setActionsDisabledState([true, false, true, false, false, false, false]);
      this.appService.setActionsHiddenState([true, false, false, true, false, false, false]);

      this.recipesService.apiRecipesIdentifierGet(identifier)
        .subscribe({
          next: (v) => this.updateForm(v),
          error: () => this.router.navigate(['404'])
        });
      this.getFavoriteState(identifier);
    }
    else {
      this.appService.setActionsDisabledState([true, true, false, false, true, true, false]);
      this.appService.setActionsHiddenState([true, true, false, true, true, true, false]);
    }
  }

  private updateForm(recipe: Recipe) {
    this.recipe = recipe;
  }

  handleAppAction(action: APP_ACTION) {
    switch (action) {
      case APP_ACTION.EDIT:
        this.editing = true;
        this.appService.setActionDisabledState(APP_ACTION.EDIT, true);
        this.appService.setActionDisabledState(APP_ACTION.SAVE, false);
        break;
      case APP_ACTION.DELETE:
        this.openDeleteDialog();
        break;
      case APP_ACTION.FAVORITE:
        this.appService.setActionHiddenState(APP_ACTION.FAVORITE, true);
        this.appService.setActionHiddenState(APP_ACTION.UNFAVORITE, false);
        this.markFavorite(this.identifier!);
        break;
      case APP_ACTION.UNFAVORITE:
        this.appService.setActionHiddenState(APP_ACTION.FAVORITE, false);
        this.appService.setActionHiddenState(APP_ACTION.UNFAVORITE, true);
        this.unmarkFavorite(this.identifier!);
        break;
      case APP_ACTION.SAVE:
        if (this.adding && !this.imageData) {
          this.snackBar.open('Add an image to your recipe.', 'Close', {
            duration: 3000,
            horizontalPosition: "end",
            verticalPosition: "bottom"
          });
          return;
        }

        this.editing = false;

        if (this.adding) {
          fetch(this.imageData!)
            .then(res => res.blob())
            .then(blob => {
              this.imagesService.apiImagesPost(blob)
                .pipe(
                  take(1)
                )
                .subscribe(val => {
                  this.recipe.image = val;

                  this.recipesService.apiRecipesPost(this.recipe)
                    .subscribe((val: Recipe) => {
                      this.router.navigate(['recipes', val.identifier]);
                    });
                });
            });
        }
        else {
          this.recipesService.apiRecipesPut(this.identifier!, <any>this.recipe)
            .subscribe(() => {
              this.router.navigate(['recipes', this.identifier]);
            });
        }

        this.appService.setActionDisabledState(APP_ACTION.EDIT, false);
        this.appService.setActionDisabledState(APP_ACTION.SAVE, true);
        break;
    }
  }

  private markFavorite(identifier: string) {
    this.metadataService.apiMetadataPost(<Metadata>{
      key: `${identifier}`,
      value: true
    })
      .pipe(
        take(1)
      )
      .subscribe();
  }

  private unmarkFavorite(identifier: string) {
    this.metadataService.apiMetadataKeyDelete(`${identifier}`)
      .pipe(
        take(1)
      )
      .subscribe();
  }

  private getFavoriteState(identifier: string) {
    this.metadataService.apiMetadataKeyGet(`${identifier}`)
      .pipe(
        take(1)
      )
      .subscribe((val: Metadata | null) => {
        if (val) {
          this.appService.setActionHiddenState(APP_ACTION.FAVORITE, false);
          this.appService.setActionHiddenState(APP_ACTION.UNFAVORITE, true);
        }
        this.appService.setActionHiddenState(APP_ACTION.FAVORITE, true);
        this.appService.setActionHiddenState(APP_ACTION.UNFAVORITE, false);
      });
  }

  private openDeleteDialog() {
    this.dialog.open(DeleteRecipeDialogComponent, {
      maxWidth: "600px"
    }).afterClosed()
      .subscribe((dialogResult: boolean) => {
        if (dialogResult === true) {
          if (this.recipe.image) {
            this.imagesService.apiImagesIdentifierDelete(this.recipe.image)
              .pipe(
                take(1)
              )
              .subscribe(_ => {
                this.recipesService.apiRecipesDelete(this.identifier!)
                  .pipe(
                    take(1)
                  )
                  .subscribe(_ => this.router.navigate(["/"]));
              });
          }
          else {
            this.recipesService.apiRecipesDelete(this.identifier!)
                  .pipe(
                    take(1)
                  )
                  .subscribe(_ => this.router.navigate(["/"]));
          }

          this.unmarkFavorite(this.identifier!);
        }
      });
  }

  public getImageUrl() {
    if (this.recipe.image) {
      return this.document.location.protocol + '//' + this.document.location.hostname + ':58363/api/Images/' + this.recipe.image;
    }
    return '';
  }

  public itemCompare(index: number) {
    return index;
  }

  public onAddIngredient() {
    this.onAddItem(ITEM_TYPE.INGREDIENTS);
  }

  public onRemoveIngredient(index: number) {
    this.onRemoveItem(ITEM_TYPE.INGREDIENTS, index);
  }

  public onAddTag() {
    this.onAddItem(ITEM_TYPE.TAGS);
  }

  public onRemoveTag(index: number) {
    this.onRemoveItem(ITEM_TYPE.TAGS, index);
  }

  public onAddDirection() {
    this.onAddItem(ITEM_TYPE.DIRECTIONS);
  }

  public onRemoveDirection(index: number) {
    this.onRemoveItem(ITEM_TYPE.DIRECTIONS, index);
  }

  public onAddEquipment() {
    this.onAddItem(ITEM_TYPE.EQUIPMENT);
  }

  public onRemoveEquipment(index: number) {
    this.onRemoveItem(ITEM_TYPE.EQUIPMENT, index);
  }

  private onAddItem(type: ITEM_TYPE) {
    switch(type) {
      case ITEM_TYPE.DIRECTIONS:
        this.recipe.directions?.push('');
        break;
      case ITEM_TYPE.EQUIPMENT:
        this.recipe.equipment?.push('');
        break;
      case ITEM_TYPE.INGREDIENTS:
        this.recipe.ingredients?.push('');
        break;
    }
  }

  private onRemoveItem(type: ITEM_TYPE, index: number) {
    switch(type) {
      case ITEM_TYPE.DIRECTIONS:
        this.recipe.directions?.splice(index, 1);
        break;
      case ITEM_TYPE.EQUIPMENT:
        this.recipe.equipment?.splice(index, 1);
        break;
      case ITEM_TYPE.INGREDIENTS:
        this.recipe.ingredients?.splice(index, 1);
        break;
    }
  }

  public onImageChange(data: string) {
    this.imageData = data;
  }

}
