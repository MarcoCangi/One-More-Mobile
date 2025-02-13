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
  urlPrincipale: string = '';
  urls: string[] = [];
  isModalOpen: boolean = false;
  CameraSource = CameraSource;  // Definisci CameraSource come proprietà

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    if (this.immagini && this.immagini.length > 0) {
      const immaginePrincipale = this.immagini.find(img => img.isImmaginePrincipale === true);
      if (immaginePrincipale) {
        this.urlPrincipale = immaginePrincipale.upload;
      }
      this.urls = this.immagini
      .filter(img => img.isImmaginePrincipale === false)
      .map(img => img.upload);

      this.immaginiArray = this.immagini;
    }
  }

  async selectImage(source: CameraSource, isProfile: boolean) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: source
    });

    const url = image.dataUrl;
    if (url) {
      if(isProfile)
        this.urlPrincipale = url;
      else
        this.urls.push(url);
      const nomeImmagine = 'camera_image_' + this.immaginiArray.length.toString();
      const nuovaImmagine: Immagini = {
        idImmagine: 0,
        idAttivita: 0,
        nomeUpload: nomeImmagine,
        upload: url,
        isImmaginePrincipale: isProfile,
        isImmaginePrincipaleTemp: false,
        ordinamento: 0,
        isVerificata: false
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
            isImmaginePrincipaleTemp: false,
            ordinamento: 0,
            isVerificata: false
          };
          this.immaginiArray.push(nuovaImmagine);
          this.immaginiChange.emit(this.immaginiArray);
        };
      }
    }
  }

  openDialog(url: string): void {
    this.selectedImageUrl = url;
    this.isModalOpen = true;
    // Apri il dialog per visualizzare l'immagine
  }

  closeModal(isClose: boolean){
    this.isModalOpen = isClose;
  }

  deletePhoto() {
    if(this.selectedImageUrl == this.urlPrincipale)
    {
      this.urlPrincipale = "";
      const newImgArray = this.immaginiArray.filter(i => i.isImmaginePrincipale != true);
      this.immaginiArray = newImgArray;
      this.immaginiChange.emit(this.immaginiArray);
    }
    else{
      const index = this.urls.indexOf(this.selectedImageUrl);
      if (index !== -1) {
        this.urls.splice(index, 1);
        this.immaginiArray.splice(index, 1);
        this.immaginiChange.emit(this.immaginiArray);
      }
    }
  }
}
