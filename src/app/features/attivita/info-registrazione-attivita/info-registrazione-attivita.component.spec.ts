import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoRegistrazioneAttivitaComponent } from './info-registrazione-attivita.component';

describe('InfoRegistrazioneAttivitaComponent', () => {
  let component: InfoRegistrazioneAttivitaComponent;
  let fixture: ComponentFixture<InfoRegistrazioneAttivitaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoRegistrazioneAttivitaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoRegistrazioneAttivitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
