import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {Currency} from '../../interfaces/currency';

/*
  Generated class for the CurrenyDataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CurrenyDataProvider {
data: Currency[];
  constructor(public http: Http) {
  }

  load() {
    if (this.data) {
      //already loaded data
      return Promise.resolve(this.data);
    }
  
    // don't have the data yet
    return new Promise<Currency[]>(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.data = [];
      this.http.get('https://openexchangerates.org/api/currencies.json')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference          
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              this.data.push({name: data[key], symbol: key})
            }
          }          
          resolve(this.data);
        });
    });
  }

}
