import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IngrandimentoImmagineDialogComponent } from './ingrandimento-immagine-dialog.component';

describe('IngrandimentoImmagineDialogComponent', () => {
  let component: IngrandimentoImmagineDialogComponent;
  let fixture: ComponentFixture<IngrandimentoImmagineDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IngrandimentoImmagineDialogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IngrandimentoImmagineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
