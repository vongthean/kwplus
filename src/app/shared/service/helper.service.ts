import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }


  getUrlFromString(url) {

    var reg = /.+?\:\/\/.+?(\/)(.+)/;
 
    var match = reg.exec(url);
 
    if(match)
      return (match[2] !== undefined ? match[2] : '');   else
    return '';
  }

  getUrlFromDomain(url) {

    var reg = /.+?(\/)(.+)/;
    var match = reg.exec(url);
   

    if(match)
      return (match[2] !== undefined ? match[2] : '');
    return '';  
  //  return '';
  }

}
