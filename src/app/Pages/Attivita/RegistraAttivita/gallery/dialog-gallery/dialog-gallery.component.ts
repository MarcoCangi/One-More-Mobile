import { Component, Input, Output, OnInit, Inject  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-gallery',
  templateUrl: './dialog-gallery.component.html',
  styleUrls: ['./dialog-gallery.component.scss'],
})
export class DialogGalleryComponent {
  @Input() img: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { img: string }) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    this.dialogRef.close('delete');
  }
}
