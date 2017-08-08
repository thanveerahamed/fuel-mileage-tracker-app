import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, Events } from 'ionic-angular'

import { SQLHelper } from '../../providers/sql-helper';
import { Vehicle } from '../../interfaces/vehicle';
import { TabsPage } from '../tabs/tabs';
import { AddVehiclePage } from '../add-vehicle/add-vehicle';

@Component({
    selector: 'page-viewvehicle',
    templateUrl: 'view-vehicle.html'
})

export class ViewVehiclePage {
    vehicle: Vehicle;
    constructor(public navParams: NavParams,
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public sqlHelper: SQLHelper, private events: Events) {
        this.vehicle = navParams.get("vehicle") as Vehicle;
    }

    deleteVehicle() {
        let alert = this.alertCtrl.create({
            title: 'Remove Vehicle',
            message: `Would you like to remove ${this.vehicle.make} ${this.vehicle.model}?`,
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Remove',
                    handler: () => {
                        this.sqlHelper.query(`delete from tblVehicle where ID = ${this.vehicle.id}`)
                            .then(data => {
                                console.log("vehicle removed!");
                                this.sqlHelper.query(`delete from tblFillUp where VehicleId = ${this.vehicle.id}`)
                                    .then(data => {
                                        console.log("fillups removed for the same vehicle!");
                                    }).catch(resp => {
                                        console.log(resp);
                                    });
                                this.events.publish('vehicle:reload');
                            }).catch(resp => {
                                console.log(resp);
                            });
                        this.navCtrl.push(TabsPage, { goToPage: 1 })
                    }
                }
            ]
        });
        // now present the alert on top of all other content
        alert.present();
    }

    editVehicle(){
        this.navCtrl.push(AddVehiclePage, {"action": "Edit", "vehicle": this.vehicle})
    }
}