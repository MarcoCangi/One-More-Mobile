import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SecondaryCarouselPromoComponent } from './secondary-carousel-promo.component';

describe('SecondaryCarouselPromoComponent', () => {
  let component: SecondaryCarouselPromoComponent;
  let fixture: ComponentFixture<SecondaryCarouselPromoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryCarouselPromoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SecondaryCarouselPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
