import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';

import { NavController, NavParams } from 'ionic-angular';

import { SQLHelper } from '../../providers/sql-helper';
import { Vehicle } from '../../interfaces/vehicle';
import { FillUp } from '../../interfaces/fillup';

import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-addfillup',
  templateUrl: 'add-fillup.html'
})

export class AddFillUpPage {
  submitted = false;
  action: string = 'Create';
  fillup: FillUp = {
    fillUpId: 0, cost: '', currentOdometerValue: '', date: '', distance: 0,
    lastOdometerValue: '', liters: '', mileage: '', pricePerLiter: '', vehicleId: 0
  };
  vehicle: Vehicle = { id: 0, imageUrl: '', make: '', model: '' };

  constructor(public navCtrl: NavController, public sqlHelper: SQLHelper, private datePipe: DatePipe, public navParams: NavParams) {

    this.action = navParams.get('actionName');

    this.sqlHelper.query(`select * from tblVehicle where id = ${navParams.get('vehicleId')}`).then(data => {
      this.vehicle = {
        id: data.res.rows.item(0).id,
        imageUrl: '',
        make: data.res.rows.item(0).Make,
        model: data.res.rows.item(0).Model
      };

      if (this.action == 'Create') {
        this.sqlHelper.query(`select CurrentODMeter from tblFillUp where  VehicleId = ${navParams.get("vehicleId")} order by FillUpId desc LIMIT 1`).then(data => {          
          if (data.res.rows.length > 0) {
            this.fillup.lastOdometerValue = data.res.rows.item(0).CurrentODMeter;
          }
        }).catch(response => {
          console.log(response)
        });

        this.fillup.date = datePipe.transform(new Date(), 'yyyy-MM-dd')
      }
      else if (this.action == 'Edit') {
        this.fillup = navParams.get('fillup') as FillUp;
      }
    }).catch(response => {
      console.log(response)
    });
  }

  addFillUp(form: NgForm) {
    this.submitted = true;
    if (!form.valid)
      return;

    this.fillup.distance = parseFloat(this.fillup.currentOdometerValue) - parseFloat(this.fillup.lastOdometerValue);
    this.fillup.liters = (parseFloat(this.fillup.cost)/parseFloat(this.fillup.pricePerLiter)).toFixed(2);
    this.fillup.mileage = (this.fillup.distance / parseFloat(this.fillup.liters)).toFixed(2);

    if (this.action == 'Create') {
      this.addFillUpToDataBase();
    }
    else if (this.action == 'Edit'){
      this.updateFillUpToDataBase();
    }
  }

  addFillUpToDataBase(){
    this.sqlHelper.query(`insert into tblFillUp(Date, PreviousODMeter ,CurrentODMeter,PricePerLiter,Liters ,Cost ,Mileage,VehicleId ,Distance) values ('${this.fillup.date}', ${this.fillup.lastOdometerValue}, ${this.fillup.currentOdometerValue}, ${this.fillup.pricePerLiter} , ${this.fillup.liters} , 
      ${this.fillup.cost}, ${this.fillup.mileage}, ${this.vehicle.id}, ${this.fillup.distance})`).then(() => {
        this.navCtrl.push(TabsPage);
      }).catch(
      (response) => {
        console.log(response.err);
      }
      );
  }

  updateFillUpToDataBase(){
    this.sqlHelper.query(`update tblFillUp
    set Date = '${this.fillup.date}',
    PreviousODMeter = ${this.fillup.lastOdometerValue},
    CurrentODMeter = ${this.fillup.currentOdometerValue},
    PricePerLiter = ${this.fillup.pricePerLiter},
    Liters = ${this.fillup.liters},
    Cost = ${this.fillup.cost},
    Mileage = ${this.fillup.mileage},
    VehicleId =  ${this.fillup.vehicleId},
    Distance = ${this.fillup.distance}
    where FillUpId= ${this.fillup.fillUpId}`)
    .then(() => {
        this.navCtrl.pop();
      }).catch(
      (response) => {
        console.log(response.err);
      }
      );
  }
}