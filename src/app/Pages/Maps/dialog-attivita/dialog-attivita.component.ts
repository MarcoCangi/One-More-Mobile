import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Attivita, Immagini } from 'src/app/EntityInterface/Attivita';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-attivita',
  templateUrl: './dialog-attivita.component.html',
  styleUrls: ['./dialog-attivita.component.scss'],
})
export class DialogAttivitaComponent  implements OnInit {

  immaginePrincipale: string | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Attivita, private router: Router, private dialog : MatDialog) {
    // Trova l'immagine principale all'interno dell'array di immagini dell'attività
    const immaginePrincipale = data.immagini?.find(img => img.isImmaginePrincipale);
    // Se è presente un'immagine principale, assegnala all'attributo immaginePrincipale
    if (immaginePrincipale) {
      this.immaginePrincipale = immaginePrincipale.upload;
    }
  }

  ngOnInit(): void {
;  }

  visualizzaDettaglio(): void {
    this.dialog.closeAll();
    this.router.navigate(['Home/dettaglio', this.data.idAttivita, this.data.nome], { state: { data: this.data } });
  }
}
