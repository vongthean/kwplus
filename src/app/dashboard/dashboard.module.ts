import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule,HttpClientJsonpModule } from '@angular/common/http';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleChartsModule } from 'angular-google-charts';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

import { TrackerComponent } from './tracker/tracker.component';
import { DashboardComponent } from './dashboard.component';
import { ListComponent } from './list/list.component';
import { ListsComponent } from './lists/lists.component';
import { SearchComponent } from './search/search.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { AddtolistComponent } from './addtolist/addtolist.component';
import { LinkProfileComponent } from './draw/link-profile/link-profile.component';


export function TranslationLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}



registerLocaleData(en);
@NgModule({
  declarations: [TrackerComponent, DashboardComponent, ListComponent, ListsComponent, SearchComponent, SearchResultComponent, SafeHtmlPipe, AddtolistComponent, LinkProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NzButtonModule,
    GoogleChartsModule,
    DashboardRoutingModule,
    TranslateModule.forRoot({
      loader: {provide: TranslateLoader, useFactory: TranslationLoaderFactory, deps: [HttpClient]}
    })
    
   
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class DashboardModule { }
