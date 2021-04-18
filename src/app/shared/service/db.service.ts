import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable,of} from 'rxjs';
import { environment } from '../../../environments/environment';

import { ListItem } from '../models/list.model';

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
const httpOptions ={
  headers:new HttpHeaders( 
    {
      'Content-Type':'Application/json',
      'kwp-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDQ4NzBiZGQxZTE2ZGI3MTYyNmFmOTQiLCJpYXQiOjE2MTUzNjI4OTN9.xM1-1B_GmXjQ5QbWoW9ajXe2fJcYifspkfo6CuZYbBE'
    }
    
  )
}

@Injectable({
  providedIn: 'root'
})

export class DbService {

  constructor(private httpClient:HttpClient) { }


  getListAll():Observable<ListItem[]>{
    return this.httpClient.get<ListItem[]>(environment.apiURL+'me/lists/',httpOptions).pipe(
    )
  }

  addList(list) {
    
    return this.httpClient.post<ListItem[]>(environment.apiURL+'me/lists/new',list,httpOptions).pipe(
      )

  }

  renameList(list_id,title) {
    
    return this.httpClient.patch(environment.apiURL+'me/lists/'+list_id,{title:title},httpOptions).pipe(
      )

  }
  deleteList(list_id) {
    
    return this.httpClient.delete(environment.apiURL+'me/lists/'+list_id,httpOptions).pipe(
      )

  }

  addKeywordsToList(list,keywords) {
    
    return this.httpClient.put(environment.apiURL+'me/lists/'+list._id+'/keywords',{keywords:keywords},httpOptions).pipe(
      )

  }

  removeKeywordsFromList(list,keywords) {
    
    return this.httpClient.patch(environment.apiURL+'me/lists/'+list._id+'/keywords',{keywords:keywords},httpOptions).pipe(
      )

  }

  getList(list_id):Observable<ListItem>{
    return this.httpClient.get<ListItem>(environment.apiURL+'keywords/list/'+list_id,httpOptions).pipe(
      )
  }

  getKeywords(query,type):Observable<KeywordItem[]>{


     //  http://localhost:3000/v1/keywords/get_keywords_idea?location_id=${query.location_id}&language_id=${query.language_id}&keywords=${query.keyword}
  
    return this.httpClient.get<KeywordItem[]>(environment.apiURL+`keywords/get_keywords_idea?location_id=${query.location_id}&language_id=${query.language_id}&keywords=${query.keyword}&type=${query.type}`,httpOptions).pipe();
  


  }

  getKeywordsByList(list_id):Observable<KeywordItem[]> {

    return this.httpClient.get<KeywordItem[]>(environment.apiURL+'keywords/list/'+list_id,httpOptions).pipe();


  }

  getSerps(keyword:string,location_id:number,page:number = 1) {

    return this.httpClient.get<{ result: Array<any> }>(environment.apiURL+`serps?kw=${keyword}&location_id=${location_id}&page=${page}`,httpOptions).pipe();


  }

  getBacklink(url:string,limit:number = 10) {

    const get = {
      url: url,
      limit: limit
    }
    return this.httpClient.post<{ result: Array<any> }>(environment.apiURL+`serps/backlinks`,get,httpOptions).pipe();


  }


}
