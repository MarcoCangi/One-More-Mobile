import { Component, Input, Output, OnInit, Inject, EventEmitter  } from '@angular/core';


@Component({
  selector: 'app-dialog-gallery',
  templateUrl: './dialog-gallery.component.html',
  styleUrls: ['./dialog-gallery.component.scss'],
})
export class DialogGalleryComponent {

  @Input() img: string | undefined;
  @Output() closeModalEvent = new EventEmitter<boolean>()
  @Output() deleteEvent = new EventEmitter<void>()

  constructor(){}

  onBackClick(): void {
    this.closeModalEvent.emit(false);
  }

  onDeleteClick(): void {
    this.deleteEvent.emit();
    this.closeModalEvent.emit(false);
  }
}
