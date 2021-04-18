import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule,HttpClientJsonpModule } from '@angular/common/http';
import { ProjectRoutingModule } from './project-routing.module';


import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

import { NewProjectComponent } from './new-project/new-project.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';
import { ProjectComponent } from './project.component';

export function TranslationLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


registerLocaleData(en);
@NgModule({
  declarations: [NewProjectComponent, ListProjectsComponent, ProjectComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NzButtonModule,
    TranslateModule.forRoot({
      loader: {provide: TranslateLoader, useFactory: TranslationLoaderFactory, deps: [HttpClient]}
    })
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class ProjectModule { }
