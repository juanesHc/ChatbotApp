import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentnotificationComponent } from './sentnotification.component';

describe('SentnotificationComponent', () => {
  let component: SentnotificationComponent;
  let fixture: ComponentFixture<SentnotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentnotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SentnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
