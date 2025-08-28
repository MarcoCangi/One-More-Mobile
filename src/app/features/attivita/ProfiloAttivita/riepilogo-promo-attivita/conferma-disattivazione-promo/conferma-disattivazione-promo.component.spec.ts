import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfermaDisattivazionePromoComponent } from './conferma-disattivazione-promo.component';

describe('ConfermaDisattivazionePromoComponent', () => {
  let component: ConfermaDisattivazionePromoComponent;
  let fixture: ComponentFixture<ConfermaDisattivazionePromoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfermaDisattivazionePromoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfermaDisattivazionePromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
