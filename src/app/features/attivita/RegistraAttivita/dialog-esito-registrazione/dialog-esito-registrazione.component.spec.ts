import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialogEsitoRegistrazioneComponent } from './dialog-esito-registrazione.component';

describe('DialogEsitoRegistrazioneComponent', () => {
  let component: DialogEsitoRegistrazioneComponent;
  let fixture: ComponentFixture<DialogEsitoRegistrazioneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEsitoRegistrazioneComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogEsitoRegistrazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
