import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CurrenyDataProvider } from '../../providers/curreny-data/curreny-data';
import { Currency } from '../../interfaces/currency';
import { Helper } from '../../providers/helper';
 
/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [CurrenyDataProvider]
})

export class SettingsPage {
  currencies: Currency[];
  currency: string;
  volume: string;
  consumption: string;
  isFormDirty: boolean;
  distance: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public currencyService: CurrenyDataProvider, public helper: Helper, public loadingCntrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loading = this.loadingCntrl.create({
      content: 'Please wait...',
      spinner: 'dots'
    });
  
    loading.present();
    this.currencyService.load().then(
      data => {
        this.currencies = data;
        this.helper.getSelectedCurrency().then(value => {   
            this.currency = value;
            loading.dismiss();
        });        
      }
    ).catch( data =>    {
      this.helper.showToast("Some error occured during loading Currencies!!", "center");
    } );

    this.helper.getSelectedVolume().then(value => {      
        this.volume = value;
    });

    this.helper.getSelectedConsumption().then(value => {      
        this.consumption = value;      
    });

    this.helper.getSelectedDistance().then(value => {
        this.distance = value;
    });
  }

  currencySelectionChange(){
    this.helper.setSelectedCurrency(this.currency);
  }

  volumeSelectionChange(){
    this.helper.setSelectedVolume(this.volume);
  }

  distanceSelectionChange(){
    this.helper.setSelectedDistance(this.distance);
  }

  consumptionSelectionChange(){
    this.helper.setSelectedConsumption(this.consumption);
  }

  // /http://apilayer.net/api/list?access_key=5d3ebf00de68499b0feba2fe3fb97560  
}
