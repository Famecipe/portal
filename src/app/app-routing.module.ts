import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipesComponent } from './recipes/recipes.component';

const routes: Routes = [
  {
    path: 'recipes', component: RecipesComponent
  },
  {
    path: 'favorites', component: RecipesComponent
  },
  {
    path: 'recent', component: RecipesComponent
  },
  {
    path: 'recipes/:identifier', component: RecipeComponent
  },
  {
    path: '', redirectTo: '/recipes', pathMatch: 'full'
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
