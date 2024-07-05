import { Component, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { Immagini } from 'src/app/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'src/app/Services/get-api-attivita.service';
import { IngrandimentoImmagineDialogComponent } from '../ingrandimento-immagine-dialog/ingrandimento-immagine-dialog.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-galleria-dettaglio',
  templateUrl: './galleria-dettaglio.component.html',
  styleUrls: ['./galleria-dettaglio.component.scss'],
})
export class GalleriaDettaglioComponent implements OnInit {

  @Input() IdAttivita: number | undefined;
  immagini: Immagini[] | undefined;

  constructor(private el: ElementRef,
              private attivitaService: GetApiAttivitaService,
              private modalController: ModalController) { }

  ngOnInit(): void {
    this.attivitaService.apiGetListaImmaginiById(this.IdAttivita).subscribe((data: Immagini[]) => {
      this.immagini = data;
    });
  }

  async apriDialogIngrandimentoImmagine(index: number): Promise<void> {
    const modal = await this.modalController.create({
      component: IngrandimentoImmagineDialogComponent,
      cssClass: 'image-modal',
      componentProps: { images: this.immagini, initialIndex: index }
    });
    return await modal.present();
  }

  closeDialog(): void {
    this.modalController.dismiss();
  }
}
