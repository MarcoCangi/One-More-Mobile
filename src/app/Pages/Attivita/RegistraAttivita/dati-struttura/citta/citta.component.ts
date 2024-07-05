import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { Comuni } from 'src/app/EntityInterface/Comuni_CAP';

@Component({
  selector: 'app-citta',
  templateUrl: './citta.component.html',
  styleUrls: ['./citta.component.scss'],
})
export class CittaComponent implements OnInit {

  comuniControl = new FormControl('', Validators.required);
  comuniFiltrati: string[] = [];
  showSuggestions: boolean = false;

  @Input() listaComuni: Comuni[] | undefined;
  @Input() citta: string | undefined;
  @Output() cittaChange: EventEmitter<Comuni> = new EventEmitter<Comuni>();

  ngOnInit() {
    this.comuniControl.valueChanges.pipe(
      debounceTime(100),
      tap((value: string | null) => {
        this.comuniFiltrati = this.filterComuni(value);
        if(this.listaComuni && this.listaComuni.find(x => x.descComune === value))
          this.showSuggestions = false;
        else
          this.showSuggestions = this.comuniFiltrati.length > 0;
      })
    ).subscribe();

    this.comuniControl.valueChanges.subscribe((value: string | null) => {
      this.emitCittaChange(value);
    });

    if (this.citta && this.citta.trim() !== '') {
      this.comuniControl.setValue(this.citta);
    }
  }

  emitCittaChange(value: string | null) {
    if (this.listaComuni && value !== null) {
      const comune = this.listaComuni.find(x => x.descComune === value);
      if (comune) {
        this.cittaChange.emit(comune);
        this.showSuggestions = false;
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
}