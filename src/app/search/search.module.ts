import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search.component';
import { WorkbasketModule } from '../workbasket/workbasket.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    WorkbasketModule
  ],
  declarations: [
    SearchComponent
  ]
})
export class SearchModule {}
