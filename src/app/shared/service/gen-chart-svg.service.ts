import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GenChartSvgService {


  columnNames = ['Search'];
  options = {legend: 'none'};

  constructor() { }

  draw(msv:Array<any> = [],className:string = '') {

    var html = '<div  class="kwp-chart-container"><svg width="46" height="23"><g>';

    if(msv !== undefined) {

      let avg_months = [];
      msv.forEach(month => {
        avg_months.push(month[2]);  
        
      });

      var min = Math.min.apply(null, avg_months),
      max = Math.max.apply(null, avg_months);

      
      let x:number = 0;
      let y:number = 23;
      msv.forEach(month => {

        let avg = (month[2]*23)/max;

        avg = Math.round(avg);

        y = 23 - avg;

        html += '<rect height="'+avg+'" width="1.5" x="'+x+'" y="'+y+'" opacity="1"></rect>';

      
        x = x + 3.5;
      });      

      html += '</g></svg></div>';

    

    }

    return html;

  }


  drawLarge(msv:Array<any> = [],className:string = '') {

    var html = '<div  class="kwp-chart-container fullwidth"><svg width="100%" height="80"><g>';

    if(msv !== undefined) {

      let avg_months = [];
      msv.forEach(month => {
        avg_months.push(month[2]);  
        
      });

      var min = Math.min.apply(null, avg_months),
      max = Math.max.apply(null, avg_months);

      
      let x:number = 0;
      let y:number = 80;
      msv.forEach(month => {

        let avg = (month[2]*80)/max;

        avg = Math.round(avg);

        if(avg === 0) avg = 2;

        y = 80 - avg;

        html += '<rect title="avg" tooltip="prompt text" tooltip-position="left" height="'+avg+'" width="10" x="'+x+'" y="'+y+'" opacity="1"></rect>';

      
        x = x + 20;
      });      

      html += '</g></svg></div>';

    

    }

    return html;

  }


  barChartMsv(msv:Array<any> = []) {

    //this.barChartData

  }

  columnChartMsv(msv) {

    var myData = [];
    console.log(myData);
    if(msv !== undefined) {

      msv.forEach(m => {

        let amv = [m[0],m[2]];
        
        myData.push(amv);

      });



      
      return myData;

    }   
    
  }  

}
