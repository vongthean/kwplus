import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router,ActivatedRoute, NavigationStart, NavigationEnd, ActivationEnd } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ListsComponent } from '../dashboard/lists/lists.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  langs = ['en', 'vn'];
  constructor(private translate: TranslateService,private _router: Router,private drawerService: NzDrawerService) {
  
 

  }

    
  ngOnInit(): void {

    this.translate.setDefaultLang('en');
    
 

  }
  public useLanguage(lang: string): void {
    this.translate.use(lang);
  }


  openLists() {

    const drawerRef = this.drawerService.create<ListsComponent, { data: object }, object>({
      nzTitle: 'Keywords list',
      nzContent: ListsComponent,
      nzPlacement: 'left',
      nzWidth: '400px',
      nzContentParams: {
        data: {}
      }
    });

  }

}
