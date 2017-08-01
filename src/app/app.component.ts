import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLHelper } from '../providers/sql-helper';
import { Storage } from '@ionic/storage';
//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { VehicleListPage } from '../pages/vehicle-list/vehicle-list';


export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

const win: any = window;

@Component({
  templateUrl: 'app.html'
})
export class FuelMileageTracker {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Home', name: 'TabsPage', component: TabsPage, tabComponent: HomePage, index: 0, icon: 'home' },
    { title: 'Vehicles', name: 'TabsPage', component: TabsPage, tabComponent: VehicleListPage, index: 1, icon: 'md-car' }
  ];

  rootPage: any;
  win: any = window;

  constructor(private platform: Platform, statusBar: StatusBar,
    private splashScreen: SplashScreen, private sqlHelper: SQLHelper,
    private storage: Storage) {

    this.rootPage = TabsPage;

    this.storage.get('hasLoggedIn')
    .then(hasLoggedIn => {
      if(hasLoggedIn){        
        this.platformReady();
      }
      else{        
        this.setUpDatabase();
        this.platformReady();
      }
    });
  }

  platformReady() {
    this.platform.ready().then(() => {
      
      this.splashScreen.hide();
    });
  }

  setUpDatabase() {

    // this.sqlHelper.query('create table IF NOT EXISTS tblVehicle(id int PRIMARY KEY AUTOINCREMENT, ImageUrl varchar(30), Make varchar(30), Model varchar(30))')
    //   .then(() => {
    //     console.log('creted SQL');
    //   })
    //   .catch(e => console.log(e));

    // this.sqlHelper.query(`insert into tblVehicle(Make, Model, ImageUrl) values (?, ?, ?)`, ['make', 'model', 'image'])
    //   .then(() => {
    //     console.log('insert SQL');
    //   }).catch(e => console.log(e));

    //   this.sqlHelper.query(`select * from tblVehicle`, [])
    //     .then(results =>{ console.log(results);
    //       console.log(results.res.rows.item(0));
    //     }
    //   )
    //     .catch(e => console.log(e));
  }

  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNav() && page.index != undefined) {      
      this.nav.getActiveChildNav().select(page.index);
      // Set the root of the nav with params if it's a tab index
    } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    // if (page.logsOut === true) {
    //   // Give the menu time to close before changing to logged out
    //   this.userData.logout();
    // }
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }
}

