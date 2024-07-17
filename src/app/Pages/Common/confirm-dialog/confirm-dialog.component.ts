import { Component,OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent  implements OnInit {

  constructor(  @Inject(MAT_DIALOG_DATA) 
                public data : any,
                public dialogRef: MatDialogRef<ConfirmDialogComponent>){}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    
  }

  closeDialog(){
    this.dialogRef.close(false);
  }
}
