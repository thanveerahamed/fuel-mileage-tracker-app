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
    id: null, amount: null, date: null, odometer: null, distance: null,
    liters: null, mileage: null, pricePerLiter: null, vehicleId: null, previousLiters: null, previousOdometer: null
  };
  vehicle: Vehicle = { id: 0, imageUrl: '', make: '', model: '' };
  previousOdometer: number = 0;
  previousLiters: number = 0;
  isFirstFillUp: boolean = false;

  constructor(public navCtrl: NavController, public sqlHelper: SQLHelper, private datePipe: DatePipe, public navParams: NavParams) {

    this.action = navParams.get('actionName');

    this.sqlHelper.query(`select * from tblVehicle where id = ${navParams.get('vehicleId')}`).then(data => {
      this.vehicle = {
        id: data.res.rows.item(0).ID,
        imageUrl: '',
        make: data.res.rows.item(0).Make,
        model: data.res.rows.item(0).Model
      };

      if (this.action == 'Create') {
        this.sqlHelper.query(`select odometer, liters from tblFillUp where  VehicleId = ${navParams.get("vehicleId")} order by ID desc LIMIT 1`).then(data => {
          if (data.res.rows.length > 0) {
            this.previousOdometer = data.res.rows.item(0).Odometer;
            this.previousLiters = data.res.rows.item(0).Liters;
          }
          else {
            this.isFirstFillUp = true;
          }
        }).catch(response => {
          console.log(response)
        });

        this.fillup.date = datePipe.transform(new Date(), 'yyyy-MM-dd')
      }
      else if (this.action == 'Edit') {        
        this.fillup = navParams.get('fillup') as FillUp;
        this.previousOdometer = this.fillup.previousOdometer;
        this.previousLiters = this.fillup.previousLiters;
      }
    }).catch(response => {
      console.log(response)
    });
  }

  addFillUp(form: NgForm) {    
    this.submitted = true;
    if (!form.valid)
      return;

    if (this.isFirstFillUp) {
      this.fillup.mileage = null;
      this.fillup.distance = null;
    }        
    else{
        this.fillup.distance = this.fillup.odometer - this.previousOdometer;
        this.fillup.mileage = parseFloat((this.fillup.distance/this.previousLiters).toFixed(2));     
    } 

    this.fillup.liters = parseFloat((this.fillup.amount / this.fillup.pricePerLiter).toFixed(2));

    if (this.action == 'Create') {
      this.addFillUpToDataBase();
    }
    else if (this.action == 'Edit') {
      this.updateFillUpToDataBase();
    }
  }

  addFillUpToDataBase() {    
    console.log(`insert into tblFillUp(Date, Odometer,PricePerLiter,Liters ,Amount ,Mileage,VehicleId ,Distance) 
    values ('${this.fillup.date}', ${this.fillup.odometer}, ${this.fillup.pricePerLiter} , ${this.fillup.liters} , ${this.fillup.amount}, ${this.fillup.mileage}, ${this.vehicle.id}, ${this.fillup.distance})`)
    this.sqlHelper.query(`insert into tblFillUp(Date, Odometer,PricePerLiter,Liters ,Amount ,Mileage,VehicleId ,Distance) values ('${this.fillup.date}', ${this.fillup.odometer}, ${this.fillup.pricePerLiter} , ${this.fillup.liters} , 
      ${this.fillup.amount}, ${this.fillup.mileage}, ${this.vehicle.id}, ${this.fillup.distance})`).then(() => {
        this.navCtrl.push(TabsPage);
      }).catch(
      (response) => {
        console.log(response.err);
      }
      );
  }

  updateFillUpToDataBase() {
    this.sqlHelper.query(`update tblFillUp
    set Date = '${this.fillup.date}',
    Odometer = ${this.fillup.odometer},
    PricePerLiter = ${this.fillup.pricePerLiter},
    Liters = ${this.fillup.liters},
    Amount = ${this.fillup.amount},
    Mileage = ${this.fillup.mileage},
    VehicleId =  ${this.fillup.vehicleId},
    Distance = ${this.fillup.distance}
    where ID= ${this.fillup.id}`)
      .then(() => {
        this.navCtrl.pop();
      }).catch(
      (response) => {
        console.log(response.err);
      }
      );
  }
}