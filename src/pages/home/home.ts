import { Component } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';
import { AlertController, App, FabContainer, ItemSliding, List, ModalController, ToastController, Refresher } from 'ionic-angular';
import { Vehicle } from '../../interfaces/vehicle';
import { FillUp } from '../../interfaces/fillup';
import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';

import { SQLHelper } from '../../providers/sql-helper';
import { AddFillUpPage } from '../add-fillup/add-fillup';
import { FillUpDetailPage } from '../view-fillup/view-fillup';
import { AddVehiclePage } from '../add-vehicle/add-vehicle';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  vehicles: Vehicle[] = [];
  vehicleSelect: any;
  fillUps: FillUp[] = [];
  selectedVehicle: number;
  selectModel: any;
  public database: SQLite;
  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public platForm: Platform,
    public sqlHelper: SQLHelper,
    public alertCtrl: AlertController, private storage: Storage, private events: Events) {    

    this.loadDropDownAndFillUps(null);
    events.subscribe('vehicle:reload', (user, time) => {
      this.loadDropDownAndFillUps(null);
    });
  }

  loadDropDownAndFillUps(refresher: Refresher) {
    this.sqlHelper.query('select * from tblVehicle').then(data => {
      let vehicles: Vehicle[] = [];      
      if (data.res.rows.length == 0) {
        this.navCtrl.push(AddVehiclePage, { "isFirstTime": true, "action": "Create" });
      }
      else {
        for (var i = 0; i < data.res.rows.length; i++) {
          let vehicle = {
            id: data.res.rows.item(i).id,
            imageUrl: 'assets/img/car.png',
            make: data.res.rows.item(i).Make,
            model: data.res.rows.item(i).Model
          }
          vehicles.push(vehicle);
        }
        this.vehicles = vehicles

        this.selectModel = this.vehicles[0].id;
        this.getFillUpByVehicle(this.selectModel, refresher);
      }
    }).catch(response => {
      console.log(response)
    });
  }

  vehicleSelectionChange() {
    this.getFillUpByVehicle(this.selectModel, null);
  }

  getFillUpByVehicle(selectedVehicleId: number, refresher: Refresher) {
    this.fillUps = [];
    this.sqlHelper.query(`select * from tblFillUp where VehicleId = ${selectedVehicleId} order by FillUpId desc`).then(data => {
      let fillUps: Vehicle[] = [];

      for (var i = 0; i < data.res.rows.length; i++) {
        let fillUp: FillUp = {
          fillUpId: data.res.rows.item(i).FillUpId,
          date: data.res.rows.item(i).Date,
          lastOdometerValue: data.res.rows.item(i).PreviousODMeter,
          currentOdometerValue: data.res.rows.item(i).CurrentODMeter,
          pricePerLiter: data.res.rows.item(i).PricePerLiter,
          liters: data.res.rows.item(i).Liters,
          cost: data.res.rows.item(i).Cost,
          mileage: data.res.rows.item(i).Mileage,
          vehicleId: this.selectModel,
          distance: data.res.rows.item(i).Distance
        }

        this.fillUps.push(fillUp);
      }


      if (refresher) {
        refresher.complete();
      }
      const toast = this.toastCtrl.create({
        message: 'Load complete...',
        duration: 3000
      });
      toast.present();
    }).catch(response => {
      console.log(response)
    });
  }

  doRefresh(refresher: Refresher) {
    this.loadDropDownAndFillUps(refresher);
  }

  openAddFillUpPage() {
    this.navCtrl.push(AddFillUpPage, { actionName: 'Create', vehicleId: this.selectModel });
  }

  removeFillUp(slidingItem: ItemSliding, fillUpData: FillUp) {
    let alert = this.alertCtrl.create({
      title: 'Delete Fill Up',
      message: 'Would you like to remove this Fill Up?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.sqlHelper.query(`delete from tblFillUp where FillUpId = ${fillUpData.fillUpId}`)
              .then(data => {
                this.getFillUpByVehicle(this.selectModel, null);
              }).catch(resp => {
                console.log(resp);
              });

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  openFillUpDetail(fillUp: FillUp) {
    this.navCtrl.push(FillUpDetailPage, { fillUp: fillUp });
  }

}
