import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {


  validateFormSearch: FormGroup;



  constructor(private router:Router, private translate: TranslateService, private httpClient:HttpClient, private fb: FormBuilder) { }

  searching: boolean = false;

  keyword:string = "";
  location_id:string = 'any';
  language_id:string = 'any';
  
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

  ngOnInit(): void {

    this.validateFormSearch = this.fb.group({
     
      keyword: [null,[Validators.required,Validators.minLength(2),Validators.maxLength(100)]],
      location_id: [null,[Validators.required,Validators.minLength(1)]],
      language_id: [null,[Validators.required,Validators.minLength(1)]],
      type: ['keywordSeed']

    });

 
  }

  search() {
    console.log(this.location_id);

    if(this.validateFormSearch.invalid) {

      return false;
    }

    let keyword = this.validateFormSearch.controls.keyword.value;
    //.validateFormSearch.controls.keyword.setValue(keyword.replace(" ","+"));

    if(this.validateFormSearch.controls.location_id.value == 'any')
      this.validateFormSearch.controls.location_id.setValue(0);
    if(this.validateFormSearch.controls.language_id.value == 'any')
      this.validateFormSearch.controls.language_id.setValue(0);  

    console.log(this.validateFormSearch.value);
    this.router.navigate(['search'],{queryParams: this.validateFormSearch.value});

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



}
