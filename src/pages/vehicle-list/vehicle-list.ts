import { Component } from '@angular/core';

import {
  ActionSheet,
  ActionSheetController,  
  Config,
  NavController,
  AlertController, Events
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AddVehiclePage } from '../add-vehicle/add-vehicle'


import { Vehicle } from '../../interfaces/vehicle';
import { SQLHelper } from '../../providers/sql-helper';
import {TabsPage} from '../tabs/tabs';
import { ViewVehiclePage } from '../view-vehicle/view-vehicle'


// TODO remove
export interface ActionSheetButton {
  text?: string;
  role?: string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean | void;
};

@Component({
  selector: 'page-vehicle-list',
  templateUrl: 'vehicle-list.html'
})
export class VehicleListPage {
  actionSheet: ActionSheet;
  vehicles: Vehicle[] = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    public sqlHelper: SQLHelper,
    public alertCtrl: AlertController,
    private events: Events
  ) { 
    events.subscribe('vehicle:reload', (user, time) => {
      this.ionViewDidLoad();
    });
  }

  ionViewDidLoad() {    
    this.sqlHelper.query('select * from tblVehicle').then(data => {
      let vehicles: Vehicle[] = [];            
        for (var i = 0; i < data.res.rows.length; i++) {
          let vehicle = {
            id: data.res.rows.item(i).ID,
            imageUrl: 'assets/img/car.png',
            make: data.res.rows.item(i).Make,
            model: data.res.rows.item(i).Model
          }
          vehicles.push(vehicle);
        }
        this.vehicles = vehicles      
    }).catch(response => {
      console.log(response)
    });
  }

  openAddvehiclePage() {
    this.navCtrl.push(AddVehiclePage, {"action": "Create"});
  }

  goToVehicleDetail(vehicle:any){
    this.navCtrl.push(ViewVehiclePage, {"vehicle": vehicle});
  }  
}