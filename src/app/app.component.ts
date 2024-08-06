import { Component } from '@angular/core';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private langService: LanguageService
  ){
    let lang = localStorage.getItem('lang')
    if(lang){
      langService.setLanguage(lang)
    }
  }
  title = 'nazox';
}
