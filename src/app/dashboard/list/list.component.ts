import { Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import { Router ,ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Query } from '../../shared/models/query.model';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddtolistComponent } from '../addtolist/addtolist.component';
import { LinkProfileComponent } from '../draw/link-profile/link-profile.component'

import { DbService } from '../../shared/service/db.service';
import { HelperService } from '../../shared/service/helper.service';
import { GenChartSvgService } from '../../shared/service/gen-chart-svg.service';


interface KeywordItem {
  _id: string;
  kw: string;
  ams: number;
  ppc: number;
  cpc: number;
  msv: Array<any>;
  language_id: number;
  location_id: number;
  disabled: boolean;
  location: any;
  language:any;
}
interface linkData {
  link: string;
  title: string;
  htmlTitle: string;
  domain: string;
  htmlSnippet: string;
  formattedUrl: string;
  pos: number;
};

interface List {
  title: string,
  user_id: string,
  created_At: number,
  updated_At: number,
  _id: string
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})



export class ListComponent implements OnInit {



  query:Query;
  validateFormSearch: FormGroup;
  validateFormRenameList: FormGroup;
  searching: boolean = false;
  gettingKeywords: boolean = false;
  gettingSerps: boolean = false;
  serpCurrentPage = 1;
  serpNextPageLoading = false;
  isRenameListLoading: boolean = false;
  isVisibleRenameList: boolean = false;
  
  keywords:KeywordItem[];
  keyword:KeywordItem;
  list:List;

  listAvg:any = {sumSearch: 0, avgcpc: 0, avgppc: 0};

  msv:Array<any> = [];
  serps: linkData[] = [];
  lastMonthPercent:number = 0;
  listOfColumn = [
    {
      title: 'Keyword',
      width: '250px',
      popoverContent: this.translate.instant('hover.keyword')
    },
    {
      title: 'Trend',
      popoverContent: this.translate.instant('hover.trend')
    },
    {
      title: 'Search',
      popoverContent: this.translate.instant('hover.search'),
      compare: (a: KeywordItem, b: KeywordItem) => a.ams - b.ams,
      priority: 3
    },
    {
      title: 'CPC',
      popoverContent: this.translate.instant('hover.cpc'),
      compare: (a: KeywordItem, b: KeywordItem) => a.cpc - b.cpc,
      priority: 2
    },
    {
      title: 'PPC',
      popoverContent: this.translate.instant('hover.ppc'),
      compare: (a: KeywordItem, b: KeywordItem) => a.ppc - b.ppc,
      priority: 1
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private httpClient:HttpClient, public translate: TranslateService,private drawerService: NzDrawerService, private dbService:DbService, public helperService:HelperService, public chartService: GenChartSvgService, private notification:NzNotificationService, private modal:NzModalService) { 

    this.keywords = [];
    this.keyword = {_id : '',kw: '',location_id: 0, language_id: 0, msv: [], ams : 0, disabled: false, ppc: 0,cpc : 0,location:{label:''},language:{label:''}};
    this.list = {_id: '', title: '', user_id: '', updated_At: 0, created_At: 0};
  }

  ngOnInit(): void {

    

    this.route.params.subscribe(params => {
    
      this.resetData();
      if(params.list_id) {

        this.gettingKeywords = true;

        this.dbService.getKeywordsByList(params.list_id).subscribe((rs:any) => {

          if(rs.list !== undefined) {

            this.list = rs.list;
            this.keywords = rs.keywords;
            this.gettingKeywords = false;

            if(this.keywords.length > 0) {
              // get keyword SERP overview
              this.selectKeywordSerp(this.keywords[0]);


              this.calculator();

            }


          } 
          

        });

      }


    });     


    this.validateFormRenameList = this.fb.group({
     
      title: [null,[Validators.required,Validators.minLength(2),Validators.maxLength(100)]],

    });
    
  
  }

  calculator() {

    let totalCPC = 0;
    let totalPPC = 0;
    this.listAvg.sumSearch = 0;
    this.listAvg.avgcpc = 0;
    this.listAvg.avgppc = 0;

    this.keywords.forEach(kw => {
      this.listAvg.sumSearch = this.listAvg.sumSearch + kw.ams;
      totalCPC = totalCPC + kw.cpc;
      totalPPC = totalPPC + kw.ppc;

    })

    this.listAvg.avgcpc = ((totalCPC/this.keywords.length));
    this.listAvg.avgppc = Math.round((totalPPC/this.keywords.length));

  }

  openRenameList() {

    this.validateFormRenameList.controls.title.setValue(this.list.title)
    this.isVisibleRenameList = true;

  }

  renameList() {

    for (const i in this.validateFormRenameList.controls) {
      this.validateFormRenameList.controls[i].markAsDirty();
      this.validateFormRenameList.controls[i].updateValueAndValidity();
    }

    if(!this.validateFormRenameList.invalid) {

      this.isRenameListLoading = true;

      this.dbService.renameList(this.list._id,this.validateFormRenameList.controls.title.value).subscribe((res:any) => {
      
        //this.validateFormRenameList.controls.title.setValue('');
        this.isRenameListLoading = false;  
        this.isVisibleRenameList = false;

        this.list.title = this.validateFormRenameList.controls.title.value;

        this.notification.create(
          'success',
          'Success',
          'Rename to <b>' + this.list.title  + '</b>'
        );

      })


    }

  


  }

  openConfirmDeleteList(): void {
    this.modal.confirm({
      nzTitle: 'Delele list',
      nzContent: 'Are you sure to delete this list? <br> <b>'+this.list.title+'</b>',
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOnOk: () => {


        this.dbService.deleteList(this.list._id).subscribe((rs:any) => {

          if(rs.action  === 'deleted') {

            window.location.href = '/';

          }

        })

      }
    });
  }

  removeFromList() {

    const requestData = this.keywords.filter(data => this.setOfCheckedId.has(data._id));
    console.log(requestData);

    this.modal.confirm({
      nzTitle: 'Remove from list',
      nzContent: 'Are you sure to remove <b>'+requestData.length+'</b> keywords from the list',
      nzOkText: 'Remove',
      nzCancelText: 'Cancel',
      nzOnOk: () => {


        this.dbService.removeKeywordsFromList(this.list,requestData).subscribe((rs:any) => {

          for(let i = 0; i < rs.length; i++) {

            this.keywords = this.keywords.filter((e) => { return e._id !== rs[i] });


            document.getElementById(rs[i]).classList.add('removed');

            document.getElementById(rs[i]).remove();

          }

            this.calculator();
            this.refreshCheckedStatus();

            this.notification.create(
              'success',
              'Success',
              'Removed <b' + rs.length + '</b> keywords'
            );


        })

      }
    });

  }
  selectKeywordSerp(keyword) {

    this.keyword = keyword;

    this.msv = [];

    this.keyword.msv.forEach(m => {

      const d = new Date(m[0],m[1],1);
      const monthName = d.toLocaleString('default', { month: 'short' });

      let avs = [monthName,m[2]];

      this.msv.push(avs);

    });
    // last month
    const lastMonth = keyword.msv.slice(-1).pop();

    this.lastMonthPercent = (Math.round(((lastMonth[2] * 100)/keyword.ams)) - 100);


    // get 
    //this.serps = [];
    this.gettingSerps = true;
    

    this.dbService.getSerps(this.keyword.kw,this.keyword.location_id,1).subscribe((rs:any) => {

      this.serps = rs.items;

      this.gettingSerps = false;

  
      document.getElementById('serp-result-card').scrollTop = 0;

    });
  }

  nextPageSerp(step:number) {

    this.serpCurrentPage = this.serpCurrentPage + (step);
    this.serpNextPageLoading = true;

    this.dbService.getSerps(this.keyword.kw,this.keyword.location_id,this.serpCurrentPage).subscribe((rs:any) =>{

      if(rs.items !== undefined && rs.items.length > 1) {

        this.serps = rs.items;
        
      }

      this.serpNextPageLoading = false;
      document.getElementById('serp-result-card').scrollTop = 0;

    })
    

  }

  removeKeyword(keyword:KeywordItem) {
    if (keyword == undefined)
        return;

    var deleteKw = [];    
    deleteKw[0] = keyword;
    
    this.dbService.removeKeywordsFromList(this.list,deleteKw).subscribe((rs:any) => {
          

        for (var i = 0; i < this.keywords.length; i++) {
          if (this.keywords[i]['_id'] === keyword._id) {
            this.keywords.splice(i, 1);
          }
      }

      document.getElementById(keyword._id).classList.add('removed');

      setTimeout(() => {

        document.getElementById(keyword._id).remove();

      },500)


      this.calculator();
      this.refreshCheckedStatus();
      this.notification.create(
        'success',
        'Success',
        'Removed <br>' + keyword.kw + '</br>'
      );
            
    }); 

    

  }

  linkProfile(url:string,title:string,keyword:string,metric:object) {

    console.log(url);

    const drawerRef = this.drawerService.create<LinkProfileComponent, { url:string,title:string,keyword:string,metric: object }, object>({
      nzTitle: 'URL Profile',
      nzContent: LinkProfileComponent,
      nzPlacement: 'right',
      nzWidth: '600px',
      nzContentParams: {
        url: url,
        title: title,
        keyword: keyword,
        metric: metric
      }
    });

  }

  resetData() {

    this.msv = [];
    this.keyword = {_id : '',kw: '',location_id: 0, language_id: 0, msv: [], ams : 0, disabled: false, ppc: 0,cpc : 0,location:{label:''},language:{label:''}};
    this.serps = [];
    this.lastMonthPercent = 0

  }

  keywordsCurrentPageData:Array<KeywordItem>;


  checked = false;
  setOfCheckedId = new Set<string>();
  updateCheckedSaveList(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSaveList(id, checked);
    this.refreshCheckedStatus();
  }
  onAllChecked(checked: boolean): void {
    this.keywordsCurrentPageData.filter(({ disabled }) => !disabled).forEach(({ _id }) => this.updateCheckedSaveList(_id, checked));
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.keywordsCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
  }
  onCurrentPageDataChange(keywordsCurrentPageData: KeywordItem[]): void {
    this.keywordsCurrentPageData = keywordsCurrentPageData;
    this.refreshCheckedStatus();
  }

  addToList() {
  

    const requestData = this.keywords.filter(data => this.setOfCheckedId.has(data._id));
    console.log(requestData);

    const drawerRef = this.drawerService.create<AddtolistComponent, { keywordsSelected: object }, object>({
        nzTitle: 'Add keywords to a list',
        nzContent: AddtolistComponent,
        nzPlacement: 'left',
        nzWidth: '400px',
        nzContentParams: {
          keywordsSelected: requestData
        }
      });

      drawerRef.afterOpen.subscribe(() => {
        console.log('Drawer(Component) open');
      });

      drawerRef.afterClose.subscribe(data => {
        console.log(data);
        this.setOfCheckedId.clear();
        this.refreshCheckedStatus();
      });
    

  }

  @ViewChild('serpResultCard')
  serpResultCard: ElementRef;
  ngAfterViewInit() {
    // var width = this.myIdentifier.nativeElement.offsetWidth;
    // var height = this.myIdentifier.nativeElement.offsetHeight;
   

    let resrpResultHeight = window.innerHeight - (document.getElementById('header-primary').offsetTop + document.getElementById('result-msv').offsetTop + document.getElementById('serp-result-title').offsetTop );
    resrpResultHeight = (resrpResultHeight - 120);

    this.serpResultCard.nativeElement.style.height = resrpResultHeight+'px';
    document.getElementById('serp-result-card').style.minHeight = resrpResultHeight+'px';

  }

  ngOnDestroy() { 
   
  }

  trackByFn(index, item) {
    return index;
  }


}
