import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RicercaAttivitaAutocompleteComponent } from './ricerca-attivita-autocomplete.component';

describe('RicercaAttivitaAutocompleteComponent', () => {
  let component: RicercaAttivitaAutocompleteComponent;
  let fixture: ComponentFixture<RicercaAttivitaAutocompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RicercaAttivitaAutocompleteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RicercaAttivitaAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
