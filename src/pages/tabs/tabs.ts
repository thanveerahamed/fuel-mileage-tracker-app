import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { VehicleListPage } from '../vehicle-list/vehicle-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = HomePage;
  tab2Root: any = VehicleListPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {    
    this.mySelectedIndex = navParams.get('goToPage') || 0;
  }

}