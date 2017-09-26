import { Component, Injectable } from '@angular/core'
import { ToastController, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';

import { Vehicle } from '../interfaces/vehicle';

@Injectable()
export class Helper {
    isMobile = false;
    SELECTED_VEHICLE = 'selectedVehicle';
    SELECTED_CURRENCY = 'selectedCurrency';
    SELECTED_VOLUME = 'selectedVolume';
    SELECTED_CONSUMPTION = 'selectedConsumption';
    SELECTED_DISTANCE = 'selectedDistance';

    constructor(public platform: Platform,
        public toastCntrl: ToastController,
        public toast: Toast, public storage: Storage) {
        if (this.platform.is('cordova'))
            this.isMobile = true;
    }

    showToast(message:string, position:string) {
        if (this.isMobile) {
            this.toast.show(message, '3000', position).subscribe(
                toast => {
                    console.log(toast);
                });
        }
        else {
            let toast = this.toastCntrl.create({
                message: message,
                duration: 3000,
                position: position
            });

            toast.onDidDismiss(() => {
                console.log('Dismissed toast');
            });

            toast.present();
        }
    }

    setSelectedVehicle(vehicle: Vehicle){
        this.storage.set(this.SELECTED_VEHICLE, vehicle); 
    }

    getSelectedVehicle(): Promise<Vehicle> {
        return this.storage.get(this.SELECTED_VEHICLE).then((value) => {
          return value;
        });
    };

    setSelectedCurrency(currency: string){
        this.storage.set(this.SELECTED_CURRENCY, currency);
    }

    getSelectedCurrency(): Promise<string> {
        return this.storage.get(this.SELECTED_CURRENCY).then((value) => {
          return value ? value : "INR";
        });
    };

    setSelectedVolume(vol: string){
        this.storage.set(this.SELECTED_VOLUME, vol);
    }

    getSelectedVolume(): Promise<string> {
        return this.storage.get(this.SELECTED_VOLUME).then((value) => {
          return value ? value : "ltr";
        });
    };

    setSelectedConsumption(vol: string){
        this.storage.set(this.SELECTED_CONSUMPTION, vol);
    }

    getSelectedConsumption(): Promise<string> {
        return this.storage.get(this.SELECTED_CONSUMPTION).then((value) => {
          return value ? value : "kmpl";
        });
    };

    setSelectedDistance(vol: string){
        this.storage.set(this.SELECTED_DISTANCE, vol);
    }

    getSelectedDistance(): Promise<string> {
        return this.storage.get(this.SELECTED_DISTANCE).then((value) => {
          return value ? value : "kms";
        });
    };
}