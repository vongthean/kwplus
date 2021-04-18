import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkProfileComponent } from './link-profile.component';

describe('LinkProfileComponent', () => {
  let component: LinkProfileComponent;
  let fixture: ComponentFixture<LinkProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
