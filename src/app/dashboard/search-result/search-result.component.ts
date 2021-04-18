import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { Router ,ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Query } from '../../shared/models/query.model';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { AddtolistComponent } from '../addtolist/addtolist.component';
import { LinkProfileComponent } from '../draw/link-profile/link-profile.component';
import { GenChartSvgService } from '../../shared/service/gen-chart-svg.service';
import { HelperService } from '../../shared/service/helper.service';
import { DbService } from '../../shared/service/db.service';



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
}
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})

export class SearchResultComponent implements OnInit {

  query:Query;
  validateFormSearch: FormGroup;
  searching: boolean = false;
  gettingKeywords: boolean = false;
  gettingSerps: boolean = false;
  serpCurrentPage = 1;
  serpNextPageLoading = false;
  
  locations : Array<{ value: number;code:string; country_code: string; label: string, target_type: string }> = [
    {
          "value": 2250,
          "country_code": "FR",
          "target_type": "Country",
          "label": "France",
          "code": "fr"

      },
      {
          "value": 2276,
          "country_code": "DE",
          "target_type": "Country",
          "label": "Germany",
          "code": "de"
      },
      {
          "value": 2643,
          "country_code": "RU",
          "target_type": "Country",
          "label": "Russia",
          "code": "ru"
      },
      {
          "value": 2704,
          "country_code": "VN",
          "target_type": "Country",
          "label": "Vietnam",
          "code": "vn"
      },
      {
          "value": 2724,
          "country_code": "ES",
          "target_type": "Country",
          "label": "Spain",
          "code": "es"
      },
      {
          "value": 2826,
          "country_code": "GB",
          "target_type": "Country",
          "label": "United Kingdom",
          "code": "gb"
      },
      {
          "value": 2840,
          "country_code": "US",
          "target_type": "Country",
          "label": "United States",
          "code": "us"
      }
  ]

  listOfColumn = [
    {
      title: 'Keyword',
      width: '200px',
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

  keywords:KeywordItem[];
  keyword:KeywordItem;

  msv:Array<any> = [];
  serps: linkData[] = [];
  lastMonthPercent:number = 0;




  ngAfterViewInit() {
    // var width = this.myIdentifier.nativeElement.offsetWidth;
    // var height = this.myIdentifier.nativeElement.offsetHeight;
   

    let resrpResultHeight = window.innerHeight - (document.getElementById('header-primary').offsetTop + document.getElementById('result-msv').offsetTop + document.getElementById('serp-result-title').offsetTop );
    resrpResultHeight = (resrpResultHeight - 120);

    this.serpResultCard.nativeElement.style.height = resrpResultHeight+'px';
    document.getElementById('serp-result-card').style.minHeight = resrpResultHeight+'px';

  }
  
  @ViewChild('serpResultCard')
  serpResultCard: ElementRef;


  constructor(private router: Router, 
      private route: ActivatedRoute, 
      private fb: FormBuilder, 
      private httpClient:HttpClient, 
      public translate: TranslateService, 
      private drawerService: NzDrawerService, 
      private dbService:DbService,
      public chartService: GenChartSvgService,
      public helperService:HelperService) { 


    this.keyword = {_id : '',kw: '',location_id: 0, language_id: 0, msv: [], ams : 0, disabled: false, ppc: 0,cpc : 0,location:{label:''},language:{label:''}};
   
    
  }

  ngOnInit(): void {

   
    this.route.queryParams.subscribe(params => {
      this.query = {
        keyword: params.keyword,
        location_id: parseInt(params.location_id),
        language_id: parseInt(params.language_id),
        type: params.type
      }

      if(this.query.keyword !== undefined && this.query.keyword !== null) {

       // this.findKeywords(this.query,params.type);

       this.gettingKeywords = true;
        this.dbService.getKeywords(this.query,params.type).subscribe((res:any) => {

          this.keywords = res;

          this.gettingKeywords = false;

          if(this.keywords.length > 0) {
            // get keyword SERP overview
            this.selectKeywordSerp(this.keywords[0]);
          }
          else 
            this.resetData();

        })

      }
    
    });

    this.validateFormSearch = this.fb.group({
     
      keyword: [null,[Validators.required,Validators.minLength(2),Validators.maxLength(100)]],
      location_id: [null,[Validators.required,Validators.minLength(1)]],
      language_id: [null,[Validators.required,Validators.minLength(1)]],
      type: ['keywordSeed']

    });

  
  }
  search() {


    if(this.validateFormSearch.controls.location_id.value == 'any')
      this.validateFormSearch.controls.location_id.setValue(0);
    if(this.validateFormSearch.controls.language_id.value == 'any')
      this.validateFormSearch.controls.language_id.setValue(0);  

    if(this.validateFormSearch.invalid) {
        console.log('form eror')
        return false;
    }  

    this.gettingKeywords = true;
    this.gettingSerps = true;
    this.keywords = [];
    this.dbService.getKeywords(this.validateFormSearch.value,this.validateFormSearch.controls.type.value).subscribe((res:any) => {

          this.keywords = res;

          this.gettingKeywords = false;
          this.gettingSerps  = false;

          if(this.keywords.length > 0)
            this.selectKeywordSerp(this.keywords[0]);
          else {
            this.resetData();
          }  

    })
   
  }
  resetData() {

    this.msv = [];
    this.keyword = {_id : '',kw: '',location_id: 0, language_id: 0, msv: [], ams : 0, disabled: false, ppc: 0,cpc : 0,location:{label:''},language:{label:''}};
    this.serps = [];
    this.lastMonthPercent = 0

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

    this.changeUrl(`/search?keyword=${this.keyword.kw}&location_id=${this.keyword.location_id}&language_id=${this.keyword.language_id}`,`${this.keyword.kw}`)


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

  findKeywords(query,type): void {
  
    this.gettingKeywords = true;

    if(type === 'list') {

      
    } else {


      this.httpClient.get<{ result: Array<any> }>(`http://localhost:3000/v1/keywords/get_keywords_idea?location_id=${query.location_id}&language_id=${query.language_id}&keywords=${query.keyword}`)
      .subscribe(data => {

        const listOfKeyword: Array<KeywordItem> = [];
  
        const result:any =  data;
        if(result.data.length >= 1) {

          result.data.forEach(item => {
            listOfKeyword.push({
              kw: item.kw,
              ams: item.ams,
              cpc: item.cpc,
              ppc: item.ppc,
              _id: item._id,
              msv: item.msv,
              language_id: item.language_id,
              location_id: item.location_id,
              disabled: false,
              location: item.location,
              language: item.language
            });
          });
          //this.keywords = listOfKeyword;

        }
        
         this.gettingKeywords = false;

      })


    }

    

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
  searchLocations(value: string): void {
  
    console.log(value.length);
    if(value.length === 0 || value === null || value === '')
      return;


      this.searching = true;
      this.httpClient.get<{ result: Array<any> }>(`http://localhost:3000/v1/location/search?s=${value}`)
      .subscribe(data => {

        const listOfOption: Array<{ value: number;code:string; country_code: string; label: string, target_type: string }> = [];
  
        const result:any =  data;
        if(result.data.length >= 1) {

          result.data.forEach(item => {
            listOfOption.push({
              value: item._id,
              label: item.label,
              country_code: item.country_code,
              code: item.code,
              target_type: item.target_type
            });
          });
          this.locations = listOfOption;

        }
        
        this.searching = false  

      })

    
    
  }


  changeUrl(url:string,title:string = '') {  
    if (typeof(history.pushState) != "undefined") {  
        var obj = { Title: title, Url: url };  
        document.title = title;
        history.pushState(obj, obj.Title, obj.Url);  
    }
  } 

  ngOnDestroy() { 
    
  }

  trackByFn(index, item) {
    return index;
  }

}
