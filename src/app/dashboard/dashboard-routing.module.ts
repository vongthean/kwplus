import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackerComponent } from './tracker/tracker.component';
import { ListComponent } from './list/list.component';
import { ListsComponent } from './lists/lists.component';
import { DashboardComponent } from './dashboard.component';
import { SearchComponent } from './search/search.component';
import { SearchResultComponent } from './search-result/search-result.component';

const routes: Routes = [
  {
    
    path: '', component: DashboardComponent,
        children: [
            
            { path: '', component: SearchComponent, pathMatch:'full' },
            { path: 'search', component: SearchResultComponent },
            { path: 'tracker', component: TrackerComponent },
            { path: 'list/:list_id', component: ListComponent}
        ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
