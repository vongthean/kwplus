import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';

const routes: Routes = [
    {
      
      path: '', component: ProjectComponent,
          children: [
              { path: '', component: ListProjectsComponent, pathMatch:'full' },
              { path: 'new', component: NewProjectComponent }
          ]
  
    }
];
  

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule { }  