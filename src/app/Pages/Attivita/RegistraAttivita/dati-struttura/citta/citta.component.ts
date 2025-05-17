import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-citta',
  templateUrl: './citta.component.html',
  styleUrls: ['./citta.component.scss'],
})
export class CittaComponent implements OnInit {

  comuniControl = new FormControl('', Validators.required);
  comuniFiltrati: string[] = [];
  showSuggestions: boolean = false;
  hasComuneError: boolean = false;

  @Input() listaComuni: Comuni[] | undefined;
  @Input() citta: string | undefined;
  @Output() cittaChange: EventEmitter<Comuni> = new EventEmitter<Comuni>();

  ngOnInit() {
    this.comuniControl.valueChanges.pipe(
      debounceTime(100),
      tap((value: string | null) => {
        this.comuniFiltrati = this.filterComuni(value);
        this.showSuggestions = this.comuniFiltrati.length > 0;
      
        // Emissione se valido
        this.emitCittaChange(value);
      })
    ).subscribe();
  
    if (this.citta && this.citta.trim() !== '') {
      this.comuniControl.setValue(this.citta);
    }
  }


  emitCittaChange(value: string | null, emitOnValidOnly: boolean = true) {
    if (!value || value.trim() === '') {
      this.hasComuneError = true;
      return;
    }

    const comune = this.listaComuni?.find(
      x => x.descComune.toLowerCase() === value.trim().toLowerCase()
    );

    if (comune) {
      this.hasComuneError = false;
      this.cittaChange.emit(comune);  // ✅ Emissione corretta
      this.showSuggestions = false;
    } else {
      this.hasComuneError = true;
      if (!emitOnValidOnly) {
        // puoi notificare comunque al padre che non è valido, se ti serve
      }
    }
  }


  filterComuni(value: string | null): string[] {
    const filterValue = (value || '').toLowerCase();
    if (this.listaComuni) {
      return this.listaComuni
        .filter(comune => comune.descComune && comune.descComune.toLowerCase().startsWith(filterValue))
        .slice(0, 4)
        .map(comune => comune.descComune);
    }
    return [];
  }

  onSearchChange(event: any) {
    const value = event.target.value;
    this.comuniFiltrati = this.filterComuni(value);
    this.showSuggestions = this.comuniFiltrati.length > 0;
  }

  selectComune(comune: string) {
    this.comuniControl.setValue(comune);
    this.comuniFiltrati = [];
    this.showSuggestions = false;
    this.emitCittaChange(comune);
  }

  onFocus() {
  this.showSuggestions = this.comuniFiltrati.length > 0;
}

  onBlur() {
    setTimeout(() => {
      this.showSuggestions = false;
      this.emitCittaChange(this.comuniControl.value);  // forza l’emissione se valido
    }, 200);
  }
}