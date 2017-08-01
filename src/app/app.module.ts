import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLHelper } from '../providers/sql-helper'
import { DatePipe } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage';

import { FuelMileageTracker } from './app.component';
import { HomePage } from '../pages/home/home';
import { VehicleListPage } from '../pages/vehicle-list/vehicle-list';
import { TabsPage } from '../pages/tabs/tabs';
import { AddVehiclePage } from '../pages/add-vehicle/add-vehicle';
import { AddFillUpPage } from '../pages/add-fillup/add-fillup';
import { FillUpDetailPage } from '../pages/view-fillup/view-fillup';
import { ViewVehiclePage } from '../pages/view-vehicle/view-vehicle';

@NgModule({
  declarations: [
    FuelMileageTracker,
    HomePage,
    VehicleListPage,
    TabsPage,
    AddVehiclePage,
    AddFillUpPage,
    FillUpDetailPage,
    ViewVehiclePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(FuelMileageTracker, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs' },
        { component: HomePage, name: 'Home', segment: 'home' },
        { component: VehicleListPage, name: 'VehicleList', segment: 'vehicleList' },
        { component: AddVehiclePage, name: 'AddVehicle', segment: 'addVehicle' },
        { component: AddFillUpPage, name: 'AddFillUp', segment: 'addFillup' },
        { component: FillUpDetailPage, name: 'FillUpDetail', segment: 'fillUpDetail' },
        { component: ViewVehiclePage, name: 'VehicleDetail', segment: 'vehicleDetail' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    FuelMileageTracker,
    HomePage,
    VehicleListPage,
    AddVehiclePage,
    TabsPage,
    AddFillUpPage,
    FillUpDetailPage,
    ViewVehiclePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    SQLite,    
    SQLHelper,
    DatePipe,    
    { provide: ErrorHandler, useClass: IonicErrorHandler }    
  ]
})
export class AppModule { }
