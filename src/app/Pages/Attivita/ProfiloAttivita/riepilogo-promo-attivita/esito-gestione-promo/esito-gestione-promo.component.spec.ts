import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EsitoGestionePromoComponent } from './esito-gestione-promo.component';

describe('EsitoGestionePromoComponent', () => {
  let component: EsitoGestionePromoComponent;
  let fixture: ComponentFixture<EsitoGestionePromoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EsitoGestionePromoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EsitoGestionePromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
