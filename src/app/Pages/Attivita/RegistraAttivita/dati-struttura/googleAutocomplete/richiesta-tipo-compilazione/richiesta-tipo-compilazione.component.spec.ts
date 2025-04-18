import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RichiestaTipoCompilazioneComponent } from './richiesta-tipo-compilazione.component';

describe('RichiestaTipoCompilazioneComponent', () => {
  let component: RichiestaTipoCompilazioneComponent;
  let fixture: ComponentFixture<RichiestaTipoCompilazioneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RichiestaTipoCompilazioneComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RichiestaTipoCompilazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
