import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'one-more-frontend-common/projects/one-more-fe-service/src/alert-service';
import { AlertInterface } from 'one-more-frontend-common/projects/one-more-fe-service/src/Enum/AlertInternace';


@Component({
  selector: 'app-closable-alert',
  templateUrl: './closable-alert.component.html',
  styleUrls: ['./closable-alert.component.scss'],
})
export class ClosableAlertComponent  implements OnInit {

  alert?: AlertInterface;
  timeout?: number;

  constructor(private alertService:AlertService){}


  ngOnInit(): void{
    this.alertService.getAlert().subscribe((alert)=>{
      this.alert = alert;
      this.resetTimer();
    })
  }

  resetTimer():void{
    this.timeout = window.setTimeout(()=>{
      this.alert=undefined;
    }, 3000);
  }
}
