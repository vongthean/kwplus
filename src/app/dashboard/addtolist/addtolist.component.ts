import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DbService } from '../../shared/service/db.service';

interface ListItem {
  _id: string;
  title: string;
  created_At: number;
  updated_At: number;
  keyword_ids: object
}
@Component({
  selector: 'app-addtolist',
  templateUrl: './addtolist.component.html',
  styleUrls: ['./addtolist.component.css']
})
export class AddtolistComponent implements OnInit {

  @Input() keywordsSelected;
  isVisibleNewList: boolean =false;
  isAddListLoading: boolean = false;
  validateFormAddList: FormGroup;

  lists:Array<ListItem>;

  constructor(private dbService: DbService, private drawerRef: NzDrawerRef<string>, public translate: TranslateService,private fb: FormBuilder, private notification: NzNotificationService) { }

  ngOnInit(): void {

    console.log(this.keywordsSelected);

    this.dbService.getListAll().subscribe((res : any) => {

        this.lists = res;

    });

    this.validateFormAddList = this.fb.group({
     
      title: [null,[Validators.required,Validators.minLength(2),Validators.maxLength(100)]],

    });

  }

  addList() {
    this.isVisibleNewList = true;
  }

  handleAddList() {

    for (const i in this.validateFormAddList.controls) {
      this.validateFormAddList.controls[i].markAsDirty();
      this.validateFormAddList.controls[i].updateValueAndValidity();
    }

    if(!this.validateFormAddList.invalid) {

      this.isAddListLoading = true;

      this.dbService.addList({title: this.validateFormAddList.controls.title.value}).subscribe((res:any) => {
        this.lists.unshift(res);
        this.validateFormAddList.controls.title.setValue('');
        this.isAddListLoading = false;  
        this.isVisibleNewList = false;
      })

    }

  }

  handleCancelList() {

    this.isVisibleNewList = false;

  }

  addKeywordsToList(list:any) {


    this.dbService.addKeywordsToList(list,this.keywordsSelected).subscribe((res:any) => {

        if(res.status === 'ok') {

          this.notification.create(
            'success',
            'Success',
            'Added <b>' + res.added + '</b> keywords to <b>' + list.title + '</b>'
          );
      
          this.close();

        }

    });

  
  }

  close(): void {
    this.drawerRef.close(this.keywordsSelected);
  }

}
