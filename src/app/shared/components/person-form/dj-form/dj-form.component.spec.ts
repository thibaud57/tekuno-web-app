import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DjFormComponent } from './dj-form.component';

describe('DjFormComponent', () => {
  let component: DjFormComponent;
  let fixture: ComponentFixture<DjFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DjFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DjFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
