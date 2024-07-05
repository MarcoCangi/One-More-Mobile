import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PromoAttiveUtenteComponent } from './promo-attive-utente.component';

describe('PromoAttiveUtenteComponent', () => {
  let component: PromoAttiveUtenteComponent;
  let fixture: ComponentFixture<PromoAttiveUtenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoAttiveUtenteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PromoAttiveUtenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
