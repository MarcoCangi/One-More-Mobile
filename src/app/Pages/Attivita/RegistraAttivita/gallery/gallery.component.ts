import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Immagini } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {

  @Input() requiredFileType!: string;
  @Input() immagini: Immagini[] | undefined;
  immaginiArray: Immagini[] = [];
  @Output() immaginiChange: EventEmitter<Immagini[]> = new EventEmitter<Immagini[]>();

  selectedImageUrl: string = '';
  urls: string[] = [];
  CameraSource = CameraSource;  // Definisci CameraSource come proprietà

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    if (this.immagini && this.immagini.length > 0) {
      this.urls = this.immagini.map(img => img.upload);
      this.immaginiArray = this.immagini;
    }
  }

  async selectImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: source
    });

    const url = image.dataUrl;
    if (url) {
      this.urls.push(url);

      const nuovaImmagine: Immagini = {
        idImmagine: 0,
        idAttivita: 0,
        nomeUpload: 'camera_image',
        upload: url,
        isImmaginePrincipale: false,
        ordinamento: 0
      };
      this.immaginiArray.push(nuovaImmagine);
      this.immaginiChange.emit(this.immaginiArray);
    }
  }

  onFileSelected(e: any) {
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const fileName = file.name;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          const url = event.target.result;
          this.urls.push(url);

          const nuovaImmagine: Immagini = {
            idImmagine: 0,
            idAttivita: 0,
            nomeUpload: fileName,
            upload: url,
            isImmaginePrincipale: false,
            ordinamento: 0
          };
          this.immaginiArray.push(nuovaImmagine);
          this.immaginiChange.emit(this.immaginiArray);
        };
      }
    }
  }

  openDialog(url: string): void {
    this.selectedImageUrl = url;
    // Apri il dialog per visualizzare l'immagine
  }

  deletePhoto() {
    const index = this.urls.indexOf(this.selectedImageUrl);
    if (index !== -1) {
      this.urls.splice(index, 1);
      this.immaginiArray.splice(index, 1);
      this.immaginiChange.emit(this.immaginiArray);
    }
  }
}
