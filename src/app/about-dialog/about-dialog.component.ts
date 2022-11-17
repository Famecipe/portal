import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss']
})
export class AboutDialogComponent implements OnInit {

  public name = environment.name;
  public version = environment.version;
  public year = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
