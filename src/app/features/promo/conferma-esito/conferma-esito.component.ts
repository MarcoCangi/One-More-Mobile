import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conferma-esito',
  templateUrl: './conferma-esito.component.html',
  styleUrls: ['./conferma-esito.component.scss'],
})
export class ConfermaEsitoComponent  implements OnInit {

  constructor( private router: Router
  ) {}
  
    ngOnInit(): void {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    Home(): void {
      this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
          this.router.navigate(['Home']);
      });
    }
  
    RedirectInfo(){
      this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/Home/Info']);
      });
    }
  }
