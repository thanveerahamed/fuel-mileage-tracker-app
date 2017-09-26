import { Component } from '@angular/core';
import { NavParams, NavController, AlertController } from 'ionic-angular'
import { SQLHelper } from '../../providers/sql-helper';
import { Helper } from '../../providers/helper';

import { FillUp } from '../../interfaces/fillup';
import { AddFillUpPage } from '../add-fillup/add-fillup';
import { TabsPage } from '../tabs/tabs'

@Component({
  selector: 'page-fillupdetail',
  templateUrl: 'view-fillup.html'
})

export class FillUpDetailPage {
fillUp: FillUp = {
    id: 0, amount: 0, odometer: 0, date: '', distance: 0, liters: 0, mileage: 0, pricePerLiter: 0, vehicleId: 0, previousLiters:0, previousOdometer:0
  };

  distanceUnit: string;
  volumeUnit: string;
  consumptionUnit: string;
  currency: string;

  constructor(private navParams: NavParams, private navCntrl: NavController, private alertCtrl:AlertController,
private sqlhelper: SQLHelper, private helper: Helper){  
      this.fillUp = navParams.get('fillUp') as FillUp;
      this.helper.getSelectedConsumption().then(value => {
        this.consumptionUnit = value;
      });
      this.helper.getSelectedCurrency().then(value => {
        this.currency = value;
      });
      this.helper.getSelectedDistance().then(value => {
        this.distanceUnit = value;
      });
      this.helper.getSelectedVolume().then(val => {
        this.volumeUnit = val;
      });
  }

  editFillUp(){
      this.navCntrl.push(AddFillUpPage, { actionName: 'Edit', fillup: this.fillUp, vehicleId: this.fillUp.vehicleId});
  }

  deleteFillUp(){
      let alert = this.alertCtrl.create({
      title: 'Delete Fill Up',
      message: 'Would you like to remove this Fill Up?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {           
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.sqlhelper.query(`delete from tblFillUp where ID = ${this.fillUp.id}`)
              .then(data => {         
                  this.navCntrl.push(TabsPage, {goToPage: 0})       
              }).catch(resp => {
                console.log(resp);
              });
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }
}