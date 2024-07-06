import { Attivita, TipoAttivita, InsertAttivitaReqDto, AttivitaHomePageResponse, AttivitaSession, Orari, Immagini, AttivitaFiltrate, FiltriAttivita, AttivitaRicerca } from './../EntityInterface/Attivita';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Comuni, Comuni_CAP } from '../EntityInterface/Comuni_CAP';

@Injectable({
  providedIn: 'root'
})
export class GetApiAttivitaService {

  insertAttivita : InsertAttivitaReqDto | undefined;
  attivita : Attivita | undefined;
  attivitaFiltrate : AttivitaFiltrate | undefined;
  attivitaFiltrateResult : AttivitaFiltrate | null | undefined;
  filtroAttivita : FiltriAttivita | undefined;
  listaAttivitaPerRicerca!: AttivitaRicerca[];
  listaTipoAttivita : TipoAttivita [] | undefined;
  listaAttivitaNearHome : Attivita[] | undefined;
  listaAttivitaPromoHome : Attivita[] | undefined;
  comuni : Comuni[] | undefined;
  CAP : Comuni_CAP | undefined;
  private attivitaSubject = new BehaviorSubject<Attivita | null>(null);
  sessioneAttivita : AttivitaSession | null | undefined;
  private listaAttivitaDDLSubject = new BehaviorSubject<TipoAttivita[] | null>(null);
  listaAttivitaDDL$ = this.listaAttivitaDDLSubject.asObservable();

  constructor(private http:HttpClient) { }

  apiGetListaAttivita(): Observable<Attivita[]>{
    return this.http.get<Attivita[]>('http://192.168.8.130:7253/Attivita/get-attivita');
  }

  apiGetListaAttivitaPerRicerca(): Observable<AttivitaRicerca[]>{
    return this.http.get<AttivitaRicerca[]>('http://192.168.8.130:7253/Attivita/get-lista-attivita');
  }

  apiGetAttivitaFavorite(id:number): Observable<AttivitaRicerca[]>{
    const params = new HttpParams()
      .set('idSoggetto', id.toString())
    return this.http.get<AttivitaRicerca[]>('http://192.168.8.130:7253/Attivita/get-favorites', {params});
  }

  apiGetListaAttivitaHomePage(): Observable<AttivitaHomePageResponse>{
    return this.http.get<AttivitaHomePageResponse>('http://192.168.8.130:7253/Attivita/get-attivita-home-page');
  }

  async apiGetListaAttivitaFiltrate(filtro: FiltriAttivita): Promise<Observable<AttivitaFiltrate>> {
    let params = new HttpParams();
    
    // Aggiungi i parametri alla query solo se sono definiti
    if(filtro.tipoRicerca != undefined)
      params = params.set('tipoRicerca', filtro.tipoRicerca.toString());
    if (filtro.nome) 
      params = params.set('nome', filtro.nome);
    if (filtro.citta) 
      params = params.set('citta', filtro.citta);
    if (filtro.provincia) 
      params = params.set('provincia', filtro.provincia);
    if (filtro.codTipoAttivita) 
      params = params.set('codTipoAttivita', filtro.codTipoAttivita);
    
    if(filtro.latitudine == undefined && filtro.longitudine == undefined)
    {
      const getPositionAsync = async (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
      };
      try {
        const position = await getPositionAsync();
        if (position.coords.latitude != null && position.coords.longitude != null) {
          params = params.set('latitudine', position.coords.latitude.toString());
          params = params.set('longitudine', position.coords.longitude.toString());
        }
      } catch (error) {
        console.error("Errore durante il recupero della posizione:", error);
      }
    }
    else if(filtro.latitudine != undefined && filtro.longitudine != undefined)
    {
        params = params.set('latitudine', filtro.latitudine);
        params = params.set('longitudine', filtro.longitudine);
    }
    
    if (filtro.isPromoPresente) 
      params = params.set('isPromoPresente', filtro.isPromoPresente);
    if (filtro.dataFinePromo) 
      params = params.set('dataFinePromo', filtro.dataFinePromo.toDateString());

    if (filtro.isLunedi) 
      params = params.set('isLunedi', filtro.isLunedi);
    if (filtro.isMartedi) 
      params = params.set('isMartedi', filtro.isMartedi);
    if (filtro.isMercoledi) 
      params = params.set('isMercoledi', filtro.isMercoledi);
    if (filtro.isGiovedi) 
      params = params.set('isGiovedi', filtro.isGiovedi);
    if (filtro.isVenerdi) 
      params = params.set('isVenerdi', filtro.isVenerdi);
    if (filtro.isSabato) 
      params = params.set('isSabato', filtro.isSabato);
    if (filtro.isDomenica) 
      params = params.set('isDomenica', filtro.isDomenica);
    if (filtro.isAllDayValidita) 
      params = params.set('isAllDayValidita', filtro.isAllDayValidita);

    if (filtro.orarioValiditaDa) 
      params = params.set('orarioValiditaDa', filtro.orarioValiditaDa);
    if (filtro.orarioValiditaAl) 
      params = params.set('orarioValiditaAl', filtro.orarioValiditaAl);
    if (filtro.codTipoPromo) 
      params = params.set('codTipoPromo', filtro.codTipoPromo);

    return this.http.get<AttivitaFiltrate>('http://192.168.8.130:7253/Attivita/get-attivita-filtrata', { params });
  }

  apiGetListaTop3ImmaginiById(id:number | undefined): Observable<Immagini[]>{
    return this.http.get<Immagini[]>('http://192.168.8.130:7253/Attivita/get-top3-immagini/' + id);
  }

  apiGetListaImmaginiById(id:number | undefined): Observable<Immagini[]>{
    return this.http.get<Immagini[]>('http://192.168.8.130:7253/Attivita/get-lista-immagini/' + id);
  }

  apiGetOrariById(id:number | undefined): Observable<Orari>{
    return this.http.get<Orari>('http://192.168.8.130:7253/Attivita/get-orari-attivita/' + id);
  }

  apiGetAttivitaByIdSoggetto(id:number | undefined): Observable<any>{
    return this.http.get('http://192.168.8.130:7253/Attivita/get-attivita-by-id?idSoggetto='+id);
  }

  apiGetAttivitaByIdAttivita(id:number | undefined): Observable<any>{
    return this.http.get('http://192.168.8.130:7253/Attivita/get-attivita?idAttivita='+id);
  }

  apiGetListaDecAttivita(): Observable<TipoAttivita[]>{
    return this.http.get<TipoAttivita[]>('http://192.168.8.130:7253/Attivita/get-lista-tipoAttivita');
  }

  apiGetListaTipoAttivitaById(id:number): Observable<TipoAttivita[]>{
    return this.http.get<TipoAttivita[]>('http://192.168.8.130:7253/Attivita/get-lista-tipoAttivita-by-id'+id);
  }

  apiInsertAttivita(attivita: InsertAttivitaReqDto): Observable<any> {
    return this.http.post<InsertAttivitaReqDto>(`http://192.168.8.130:7253/Attivita/insert-attivita`, attivita);
  }

  createAttivitaSession(attivita:Attivita){
    this.sessioneAttivita = new AttivitaSession(attivita.idAttivita, attivita.idSoggetto, attivita.nome, attivita.indirizzo, attivita.citta, attivita.provincia, attivita.civico, attivita.cap, attivita.latitudine, attivita.longitudine, attivita.telefono, attivita.cellulare, attivita.isCellPubblico, attivita.email, attivita.descrizione, attivita.descrizioneOfferta, attivita.isPromoPresente, attivita.isOffertaVegetariana, attivita.isOffertaVegana, attivita.isOffertaNoGlutine, attivita.listaTipoAttivita, attivita.orari, attivita.immagini);
  }

  createListAttivitaNearHomeSession(list:Attivita []){
    this.listaAttivitaNearHome = list;
  }

  getListAttivitaNearHomeSession(){
    return this.listaAttivitaNearHome;
  }

  createListAttivitaPromoHomeSession(list:Attivita []){
    this.listaAttivitaPromoHome = list;
  }

  getListAttivitaPromoHomeSession(){
    return this.listaAttivitaPromoHome;
  }

  createListaAttivitaPerRicercaSession(listaAttRicerca:AttivitaRicerca[]){
    if(listaAttRicerca)
      this.listaAttivitaPerRicerca = listaAttRicerca;
  }

  createListaTipoAttivitaSession(listaTipoAtt:TipoAttivita[]){
    if(listaTipoAtt)
      this.listaTipoAttivita = listaTipoAtt;
  }

  GetListaTipoAttivitaSession(){
    return this.listaTipoAttivita;
  }

  GetListaAttivitaPerRicercaSession(){
    return this.listaAttivitaPerRicerca;
  }
  
  GetDatiAttivitaSession() {
    if(this.sessioneAttivita)
    {
      this.attivita = new Attivita;
      this.attivita.idAttivita = this.sessioneAttivita?.idAttivita;
      this.attivita.idSoggetto = this.sessioneAttivita.idSoggetto;
      this.attivita.nome = this.sessioneAttivita.nome;
      this.attivita.indirizzo = this.sessioneAttivita.indirizzo;
      this.attivita.citta = this.sessioneAttivita.citta;
      this.attivita.provincia = this.sessioneAttivita.provincia;
      this.attivita.civico = this.sessioneAttivita.civico;
      this.attivita.cap = this.sessioneAttivita.cap;
      this.attivita.latitudine = this.sessioneAttivita.latitudine;
      this.attivita.longitudine = this.sessioneAttivita.longitudine;
      this.attivita.telefono = this.sessioneAttivita.telefono;
      this.attivita.cellulare = this.sessioneAttivita.cellulare;
      this.attivita.isCellPubblico = this.sessioneAttivita.isCellPubblico;
      this.attivita.email = this.sessioneAttivita.email;
      this.attivita.descrizione = this.sessioneAttivita.descrizione;
      this.attivita.descrizioneOfferta = this.sessioneAttivita.descrizioneOfferta;
      this.attivita.isPromoPresente = this.sessioneAttivita.isPromoPresente;
      this.attivita.isOffertaVegetariana = this.sessioneAttivita.isOffertaVegetariana;
      this.attivita.isOffertaVegana = this.sessioneAttivita.isOffertaVegana;
      this.attivita.isOffertaNoGlutine = this.sessioneAttivita.isOffertaNoGlutine;
      this.attivita.listaTipoAttivita = this.sessioneAttivita.listaTipoAttivita;
      this.attivita.orari = this.sessioneAttivita.orari;
      this.attivita.immagini = this.sessioneAttivita.immagini;
    }
    return this.attivita;
  }
  
  deleteSession(){
    this.attivitaSubject.next(null);
  }

  setListaAttivitaFiltrate(data: AttivitaFiltrate | undefined) {
    this.resetListaAttivitaFiltrate();
    this.attivitaFiltrateResult = data;
  }

  resetListaAttivitaFiltrate() {
    this.attivitaFiltrateResult = null;
  }

  getListaAttivita() {
    return this.attivitaFiltrateResult;
  }

  setlistaAttivitaDDL(listaTipoAttivita: TipoAttivita[]) {
    listaTipoAttivita.sort((a, b) => {
      const descrizioneA = a.descrizione?.toLowerCase();
      const descrizioneB = b.descrizione?.toLowerCase();
      if (descrizioneA != undefined && descrizioneB != undefined && descrizioneA < descrizioneB) {
        return -1;
      }
      if (descrizioneA != undefined && descrizioneB != undefined && descrizioneA > descrizioneB) {
        return 1;
      }
      return 0;
    });
    this.listaAttivitaDDLSubject.next(listaTipoAttivita);
  }
  
  getlistaAttivitaDDL(): Observable<TipoAttivita[] | null> {
    return this.listaAttivitaDDL$;
  }
}
