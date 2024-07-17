import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiepilogoPromoAttivitaComponent } from './riepilogo-promo-attivita.component';

describe('RiepilogoPromoAttivitaComponent', () => {
  let component: RiepilogoPromoAttivitaComponent;
  let fixture: ComponentFixture<RiepilogoPromoAttivitaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RiepilogoPromoAttivitaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiepilogoPromoAttivitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
