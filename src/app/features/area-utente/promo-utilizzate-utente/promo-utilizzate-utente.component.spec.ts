import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PromoUtilizzateUtenteComponent } from './promo-utilizzate-utente.component';

describe('PromoUtilizzateUtenteComponent', () => {
  let component: PromoUtilizzateUtenteComponent;
  let fixture: ComponentFixture<PromoUtilizzateUtenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoUtilizzateUtenteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PromoUtilizzateUtenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
