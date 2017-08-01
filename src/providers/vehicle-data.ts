import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SQLHelper } from './sql-helper'

import { Vehicle } from '../interfaces/vehicle';
import { FillUp } from '../interfaces/fillup'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class VehicleData {
  data: any;
  vehicles: Vehicle[];
  fillUps: FillUp[];

  constructor(public http: Http,
  public sqlHelper: SQLHelper){
      
  }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/data.json')
        .map(data => { 
            //console.log(data.json());
            this.data = data.json();
            return data.json();
        });
    }
  }

getVehicles1(): Promise<any>{

  return new Promise((resolve, reject) => {
    this.sqlHelper.query('select * from tblVehicle').then(data=>{
    let vehicles: Vehicle[] = [];
    data.res.rows.forEach(value => {
        let vehicle = {
            id:value.id,
            name:value.Name,
            make:value.Make,
            model:value.Model
        }
        //vehicles.push(vehicle);
    });
  }).catch(response =>{    
    console.log(response.err)    
  });
  });
}

getVehicles(): Vehicle[]{
  let vehicles: Vehicle[] = [];
  this.sqlHelper.query('select * from tblVehicle').then(data=>{
    
    let vehicles: Vehicle[] = [];

    for(var i=0; i < data.res.rows.length; i++)
    {
        let vehicle = {
            id:data.res.rows[i].id,
            name:data.res.rows[i].Name,
            make:data.res.rows[i].Make,
            model:data.res.rows[i].Model
        }
        //vehicles.push(vehicle);
    }
  }).catch(response =>{    
    // console.log(response.err)    
  });

  return vehicles;
    //  return this.load().map((data: any) => {
    //           console.log(data);

    //   let vehicles: Vehicle[] = [];
    //   data.vehicles.forEach(value => {
    //     let vehicle = {
    //         id:value.vehicleId,
    //         name:value.name,
    //         make:value.make,
    //         model:value.model
    //     }
    //     vehicles.push(vehicle);
    // });

    //   return vehicles;
    // });
}

getFillUpsByVehicleId(id: number){    
    return this.load().map((data: any) => {
              //console.log(data);

      let fillUps: FillUp[] = [];
      data.fillUps.forEach(value => {
          if(value.vehicleId == id)
          {
              fillUps.push(value);
          }
    });

      return fillUps;
    });
}
}