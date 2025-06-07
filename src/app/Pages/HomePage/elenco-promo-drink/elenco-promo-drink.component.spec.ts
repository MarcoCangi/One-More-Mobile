import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ElencoPromoDrinkComponent } from './elenco-promo-drink.component';

describe('ElencoPromoDrinkComponent', () => {
  let component: ElencoPromoDrinkComponent;
  let fixture: ComponentFixture<ElencoPromoDrinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ElencoPromoDrinkComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ElencoPromoDrinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
