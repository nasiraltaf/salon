import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.page.html',
  styleUrls: ['./language-list.page.scss'],
})
export class LanguageListPage implements OnInit {
  languageList:any=[
    {title:'Arabic',isActive:false},
    {title:'Chinese',isActive:false},
    {title:'English',isActive:true},
    {title:'French',isActive:false},
    {title:'German',isActive:false},
    {title:'Hindi',isActive:false},
    {title:'Italian',isActive:false},
    {title:'Japanese',isActive:false},
    {title:'Korean',isActive:false},
    {title:'Latin',isActive:false},
    {title:'Portuguese',isActive:false},
  ]
  constructor() { }

  ngOnInit() {
  }

}
