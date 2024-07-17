import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfermaEliminazionePromoComponent } from './conferma-eliminazione-promo.component';

describe('ConfermaEliminazionePromoComponent', () => {
  let component: ConfermaEliminazionePromoComponent;
  let fixture: ComponentFixture<ConfermaEliminazionePromoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfermaEliminazionePromoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfermaEliminazionePromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
