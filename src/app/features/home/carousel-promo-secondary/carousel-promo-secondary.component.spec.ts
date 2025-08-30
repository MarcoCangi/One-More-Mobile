import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CarouselPromoComponentSecondary } from './carousel-promo-secondary.component';

describe('SecondaryCarouselPromoComponent', () => {
  let component: CarouselPromoComponentSecondary;
  let fixture: ComponentFixture<CarouselPromoComponentSecondary>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselPromoComponentSecondary ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselPromoComponentSecondary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
