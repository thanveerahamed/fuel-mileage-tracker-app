import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage'

import { SQLHelper } from '../../providers/sql-helper';
import { Vehicle } from '../../interfaces/vehicle';
import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-addvehicle',
  templateUrl: 'add-vehicle.html'
})

export class AddVehiclePage {
  submitted = false;
  vehicle: Vehicle = { model: '', make: '', id: 0, imageUrl: '' };
  isFirstTime: boolean = false;
  action: String = 'Create';

  constructor(public navCtrl: NavController, public sqlHelper: SQLHelper,
    private storage: Storage, private navParams: NavParams,
    private events: Events, private toastCtrl: ToastController) {
    this.isFirstTime = navParams.get('isFirstTime');
    this.action = navParams.get('action');

    if (this.isFirstTime) {
      let toast = this.toastCtrl.create({
        message: 'No vehicle added!! Please add an Vehicle..',
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    }
    else {
      var vehicle = navParams.get("vehicle") as Vehicle;
      if (vehicle) {
        this.vehicle = {
          id: vehicle.id,
          imageUrl: vehicle.imageUrl,
          make: vehicle.make,
          model: vehicle.model
        }
      }
    }
  }

  saveChanges(form: NgForm) {    
    this.submitted = true;
    if (form.valid) {
      if (this.action === 'Create') {
        this.addVehicle();
      }
      else {
        this.updateVehicle();
      }
    }
  }

  addVehicle() {
    this.sqlHelper.query(`insert into tblVehicle(Make, Model, ImageUrl) 
    values ('${this.vehicle.make}', '${this.vehicle.model}', '${this.vehicle.imageUrl}')`)
      .then(() => {
        this.events.publish('vehicle:reload');
        if (this.isFirstTime) {
          this.navCtrl.push(TabsPage, { goToPage: '0' });
        }
        else {
          this.navCtrl.push(TabsPage, { goToPage: '1' });
        }
      }).catch(
      (response) => {
        console.log(response.err);
      });
  }

  updateVehicle() {
    this.sqlHelper.query(`update tblVehicle set Make = '${this.vehicle.make}', 
    Model = '${this.vehicle.model}', 
    ImageUrl = '${this.vehicle.imageUrl}'
    where Id = ${this.vehicle.id}`)
      .then(() => {
        this.events.publish('vehicle:reload');
        this.navCtrl.push(TabsPage, { goToPage: '1' });
      }).catch(
      (response) => {
        console.log(response.err);
      });
  }
}