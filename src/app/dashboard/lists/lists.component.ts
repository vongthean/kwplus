import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TranslateService } from '@ngx-translate/core';
import { DbService } from '../../shared/service/db.service';
import { Router } from '@angular/router';

interface ListItem {
  _id: string;
  title: string;
  created_At: number;
  updated_At: number;
  keyword_ids: object
}
@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  lists:Array<ListItem>

  constructor(private router:Router, private dbService: DbService, private drawerRef: NzDrawerRef<string>, public translate: TranslateService) { }




  ngOnInit(): void {

    this.dbService.getListAll().subscribe((res : any) => {

      this.lists = res;

    });
  }

  searchByList(list) {
    this.close();
    this.router.navigate(['list',list._id],{queryParams:{}});

  }

  close(): void {
    this.drawerRef.close();
  }

}
