import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DbService } from '../../../shared/service/db.service';

import { HelperService } from '../../../shared/service/helper.service';

@Component({
  selector: 'app-link-profile',
  templateUrl: './link-profile.component.html',
  styleUrls: ['./link-profile.component.css']
})
export class LinkProfileComponent implements OnInit {


  gettingBacklinks:boolean = false;

  @Input() url;
  @Input() title;
  @Input() keyword;
  @Input() metric;

  formatDA = (percent: number) => `DA`;
  formatPA = (percent: number) => `PA`;

  backlinks:any = [];

  constructor(

    private dbService: DbService, private drawerRef: NzDrawerRef<string>, public translate: TranslateService,
    public helperService:HelperService
  ) { }

  ngOnInit(): void {

    this.gettingBacklinks = true;
    this.dbService.getBacklink(this.metric.page).subscribe((res) => {

      this.backlinks = res;


      this.gettingBacklinks = false;

    })

  }

  @HostListener('window:scroll', ['$event']) 
  scrolled(event:any):void {

    console.log(event);

  }  

  encodeURI(url) {

    return encodeURIComponent(url);

  }

}
