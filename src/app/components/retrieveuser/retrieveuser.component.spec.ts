import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveuserComponent } from './retrieveuser.component';

describe('RetrieveuserComponent', () => {
  let component: RetrieveuserComponent;
  let fixture: ComponentFixture<RetrieveuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetrieveuserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RetrieveuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
