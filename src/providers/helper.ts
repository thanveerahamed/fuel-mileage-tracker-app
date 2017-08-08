import { Component, Injectable } from '@angular/core'
import { ToastController, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';

@Injectable()
export class Helper {
    isMobile = false;
    constructor(public platform: Platform,
        public toastCntrl: ToastController,
        public toast: Toast) {
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

}