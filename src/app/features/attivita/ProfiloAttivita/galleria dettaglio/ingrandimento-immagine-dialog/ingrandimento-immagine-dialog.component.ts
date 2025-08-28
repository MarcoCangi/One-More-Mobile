import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Swiper from 'swiper';

@Component({
  selector: 'app-ingrandimento-immagine-dialog',
  templateUrl: './ingrandimento-immagine-dialog.component.html',
  styleUrls: ['./ingrandimento-immagine-dialog.component.scss'],
})
export class IngrandimentoImmagineDialogComponent implements OnInit, AfterViewInit {
  @Input() images: { upload: string }[] = [];
  @Input() initialIndex: number = 0;
  @ViewChild('swiperContainer', { static: false }) swiperContainer: ElementRef | undefined;

  constructor(private modalController: ModalController) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  ngAfterViewInit() {
    if (this.swiperContainer) {
      const swiper = new Swiper(this.swiperContainer.nativeElement, {
        initialSlide: this.initialIndex,
        speed: 400,
        slidesPerView: 1,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }
  }

  closeDialog(): void {
    this.modalController.dismiss();
  }
}
