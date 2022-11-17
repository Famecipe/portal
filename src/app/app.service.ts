import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

export enum APP_ACTION {
  ADD = 0,
  EDIT = 1,
  SAVE = 2,
  UNFAVORITE = 3,
  FAVORITE = 4,
  DELETE = 5,
  SETTINGS = 6
}

export interface IAppAction {
  id: APP_ACTION,
  name: string,
  icon: string,
  tooltip: string,
  ariaLabel: string,
  disabled: boolean,
  hidden: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private executedActionSubject: Subject<APP_ACTION> = new Subject<APP_ACTION>();

  public get executedAction$() {
    return this.executedActionSubject.asObservable();
  }

  public readonly actions: IAppAction[] = [
    {
      id: APP_ACTION.ADD,
      name: APP_ACTION[APP_ACTION.ADD],
      icon: 'add',
      ariaLabel: 'Icon button with add icon',
      tooltip: 'Create recipe',
      disabled: false,
      hidden: false
    },
    {
      id: APP_ACTION.EDIT,
      name: APP_ACTION[APP_ACTION.EDIT],
      icon: 'edit',
      ariaLabel: 'Icon button with edit icon',
      tooltip: 'Edit recipe',
      disabled: true,
      hidden: false
    },
    {
      id: APP_ACTION.SAVE,
      name: APP_ACTION[APP_ACTION.SAVE],
      icon: 'save',
      ariaLabel: 'Icon button with save icon',
      tooltip: 'Save recipe',
      disabled: true,
      hidden: false
    },
    {
      id: APP_ACTION.UNFAVORITE,
      name: APP_ACTION[APP_ACTION.UNFAVORITE],
      icon: 'favorite',
      ariaLabel: 'Icon button with unfavorite icon',
      tooltip: 'Unmark recipe as favorite',
      disabled: true,
      hidden: true
      // todo - implement favorite service
      //disabled: true,
      //hidden: false
    },
    {
      id: APP_ACTION.FAVORITE,
      name: APP_ACTION[APP_ACTION.FAVORITE],
      icon: 'favorite_border',
      ariaLabel: 'Icon button with favorite icon',
      tooltip: 'Mark recipe as favorite',
      disabled: true,
      hidden: true
      // todo - implement favorite service
      // disabled: true,
      // hidden: false
    },
    {
      id: APP_ACTION.DELETE,
      name: APP_ACTION[APP_ACTION.DELETE],
      icon: 'delete',
      ariaLabel: 'Icon button with delete icon',
      tooltip: 'Delete recipe',
      disabled: true,
      hidden: true
    },
    {
      id: APP_ACTION.SETTINGS,
      name: APP_ACTION[APP_ACTION.SETTINGS],
      icon: 'more_vert',
      ariaLabel: 'Icon button with settings icon',
      tooltip: 'View more options',
      disabled: false,
      hidden: true
    }
  ];

  constructor() { }

  public executeAction(id: APP_ACTION) {
    this.executedActionSubject.next(id);
  }

  public setActionsDisabledState(actionsDisabledState: boolean[]) {
    setTimeout(() => {
      this.actions[APP_ACTION.ADD].disabled = actionsDisabledState[APP_ACTION.ADD];
      this.actions[APP_ACTION.DELETE].disabled = actionsDisabledState[APP_ACTION.DELETE];
      this.actions[APP_ACTION.EDIT].disabled = actionsDisabledState[APP_ACTION.EDIT];
      this.actions[APP_ACTION.FAVORITE].disabled = actionsDisabledState[APP_ACTION.FAVORITE];
      this.actions[APP_ACTION.SAVE].disabled = actionsDisabledState[APP_ACTION.SAVE];
      this.actions[APP_ACTION.SETTINGS].disabled = actionsDisabledState[APP_ACTION.SETTINGS];
      this.actions[APP_ACTION.UNFAVORITE].disabled = actionsDisabledState[APP_ACTION.UNFAVORITE];
    });
  }
  
  public setActionDisabledState(id: APP_ACTION, state: boolean) {
    setTimeout(() => {
      this.actions[id].disabled = state;
    });
  }

  public setActionsHiddenState(actionsHiddenState: boolean[]) {
    setTimeout(() => {
      this.actions[APP_ACTION.ADD].hidden = actionsHiddenState[APP_ACTION.ADD];
      this.actions[APP_ACTION.DELETE].hidden = actionsHiddenState[APP_ACTION.DELETE];
      this.actions[APP_ACTION.EDIT].hidden = actionsHiddenState[APP_ACTION.EDIT];
      this.actions[APP_ACTION.FAVORITE].hidden = actionsHiddenState[APP_ACTION.FAVORITE];
      this.actions[APP_ACTION.SAVE].hidden = actionsHiddenState[APP_ACTION.SAVE];
      this.actions[APP_ACTION.SETTINGS].hidden = actionsHiddenState[APP_ACTION.SETTINGS];
      this.actions[APP_ACTION.UNFAVORITE].hidden = actionsHiddenState[APP_ACTION.UNFAVORITE];
    });
  }

  public setActionHiddenState(id: APP_ACTION, state: boolean) {
    setTimeout(() => {
      this.actions[id].hidden = state;
    });
  }

}
