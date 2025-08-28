import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DettaglioCouponNonAttComponent } from './dettaglio-coupon-non-att.component';

describe('DettaglioCouponNonAttComponent', () => {
  let component: DettaglioCouponNonAttComponent;
  let fixture: ComponentFixture<DettaglioCouponNonAttComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioCouponNonAttComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DettaglioCouponNonAttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
