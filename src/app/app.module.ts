import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RecipesComponent } from './recipes/recipes.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RecipeComponent } from './recipe/recipe.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatDividerModule } from '@angular/material/divider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApiModule as RecipeApiModule } from '../../openapi/recipes/api.module';
import { Configuration as RecipesConfiguration } from 'openapi/recipes';

import { ApiModule as MetadataApiModule } from '../../openapi/metadata/api.module';
import { Configuration as MetadataConfiguration } from 'openapi/metadata';

import { ApiModule as ImagesApiModule } from '../../openapi/images/api.module';
import { Configuration as ImagesConfiguration } from 'openapi/images';

import { NgpImagePickerModule } from 'ngp-image-picker';
import { DeleteRecipeDialogComponent } from './delete-recipe-dialog/delete-recipe-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    RecipesComponent,
    RecipeComponent,
    PageNotFoundComponent,
    AboutDialogComponent,
    DeleteRecipeDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatChipsModule,
    MatRippleModule,
    MatDividerModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    RecipeApiModule.forRoot(() => new RecipesConfiguration({
      basePath: document.location.protocol + '//' + document.location.hostname + ':58361'
    })),
    ImagesApiModule.forRoot(() => new ImagesConfiguration({
      basePath: document.location.protocol + '//' + document.location.hostname + ':58363'
    })),
    MetadataApiModule.forRoot(() => new MetadataConfiguration({
      basePath: document.location.protocol + '//' + document.location.hostname + ':58362'
    })),
    NgpImagePickerModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
