import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, async, firstValueFrom, Observer} from 'rxjs';
import { filter } from 'rxjs/operators';
import { ProfileUser, UserSession, Utente } from 'src/app/EntityInterface/Utente';
import { User, UserCredential, createUserWithEmailAndPassword, getAdditionalUserInfo, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { GoogleAuthProvider, FacebookAuthProvider} from 'firebase/auth'
import 'firebase/compat/auth';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, docData, getDoc, setDoc } from '@angular/fire/firestore';
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userSession: UserSession | null;
  position: GeolocationPosition | undefined;
  idPage!: number;

  /////////////////////// FIREBASE ///////////////////////  

  private currentUser$ = authState(this.firebaseAut).pipe(
    filter(u => !!u)
  )
  authService: any;
  
  constructor(private cookieService:CookieService, 
              private http:HttpClient,
              private firebaseAut: Auth, 
              private firestore: Firestore) {

    this.userSession = this.getUserSessionFromCookie();
    if(this.userSession){
      this.isLoggedInSubject.next(true);
    }
    else {
      this.isLoggedInSubject.next(false);
    }
  }

  async getCurrentUser(uid: string): Promise<ProfileUser | undefined> {
    const userDocRef = doc(this.firestore, 'users', uid);
  
    try {
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const user: ProfileUser = {
          uid: userData['uid'],
          displayName: userData['displayName'],
          email: userData['email'],
          photoURL: userData['photoURL'] || '',
          nome: userData['nome'] || '',
          cognome: userData['cognome'] || '',
        };
        return user;
      } else {
        console.log('Il documento utente non esiste');
        return undefined;
      }
    } catch (error) {
      console.error('Errore durante il recupero del documento utente:', error);
      throw error;
    }
  }

  async logOut(): Promise<void>{
    this.deleteUserSessionFromCookie();
    return signOut(this.firebaseAut);
  }

  async login(email: string, password: string): Promise<{ userCredential: UserCredential, token: string }> {
    const userCredential = await signInWithEmailAndPassword(this.firebaseAut, email, password);
    const token = await userCredential.user.getIdToken();
    return { userCredential, token };
  }

  signUp(email: string, password: string): Promise<{ userCredential: UserCredential, token: string }> {
    return createUserWithEmailAndPassword(this.firebaseAut, email, password)
      .then(async (userCredential: UserCredential) => {
        const token = await userCredential.user.getIdToken();
        return { userCredential, token };
      });
  }

  setDisplayName(user: User, name: string): Promise<void>{
    return updateProfile(user, {displayName: name});
  }

  addUser(user:ProfileUser): Promise<void>{
    return setDoc(doc(this.firestore, "users", user.uid), {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL ?? '',
      nome: user.nome ?? '',
      cognome: user.cognome ?? '',
    });
  }

  passwordReset(email: string): Promise<void>{
    return sendPasswordResetEmail(this.firebaseAut, email);
  }

  googleProvider = new GoogleAuthProvider();

   async GoogleLogIn(): Promise<ProfileUser | null>{
    const userCredential =  await signInWithPopup(this.firebaseAut, this.googleProvider);
    const additionalInfo = getAdditionalUserInfo(userCredential);

    const{
      user: { uid, email, displayName}
    } = userCredential;

    const token = await userCredential.user.getIdToken();

    const newProfile = {
      uid,
      email: email ?? '',
      displayName: displayName ?? '',
      token: token ?? ''
    }

    return Promise.resolve(newProfile);
  }

  facebookProvider = new FacebookAuthProvider();

   async FacebookLogIn(): Promise<ProfileUser | null>{
    const userCredential =  await signInWithPopup(this.firebaseAut, this.facebookProvider);
    const additionalInfo = getAdditionalUserInfo(userCredential);

      const{
        user: { uid, email, displayName}
      } = userCredential;
  
      const token = await userCredential.user.getIdToken();

      const newProfile = {
        uid,
        email: email ?? '',
        displayName: displayName ?? '',
        token: token ?? ''
      }
      
    return Promise.resolve(newProfile);
  }

  async refreshToken(userSession: UserSession): Promise<boolean> {
    try {
      const currentUser = await firstValueFrom(this.currentUser$); // Converti l'osservabile in una promessa
  
      if (currentUser) {
        const refreshedToken = await currentUser.getIdToken(true);
        if (refreshedToken) {
          userSession.token = refreshedToken;
          this.saveUserSessionToCookie(userSession);
          return true;  
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error('Errore durante il refresh del token:', error);
      return false;
    }
  }

    /////////////////////////////////////////////////////////  

    //////////////////////COOKIE////////////////////////////

    saveUserSessionToCookie(userSession: UserSession) {
      // Salva i dati della sessione dell'utente nei cookie come un unico oggetto JSON
      this.cookieService.set('userSession', JSON.stringify(userSession));
    }
    
    getUserSessionFromCookie(): UserSession | null { 
      // Verifica se il cookie della sessione dell'utente esiste
      if (this.cookieService.check('userSession')) {
        // Recupera i dati della sessione dell'utente dai cookie
        const userSessionString = this.cookieService.get('userSession');
        // Deserializza l'oggetto JSON in un oggetto UserSession
        const userSession: UserSession = JSON.parse(userSessionString);
        return userSession;
      } else {
        // Se il cookie non esiste, restituisci null
        return null;
      }
    }
    
    deleteUserSessionFromCookie() {
      // Rimuovi il cookie della sessione dell'utente
      this.cookieService.delete('userSession');
    }


    ////////////////////////////////////////////////////////////


  isAuthenticated() {
    return this.isLoggedInSubject.value;
  }

  createUserSession(email: string, uid : string | undefined, token : string, idAttivita : number, idUser: number, photoURL:string, typeLog: number, displayName: string, nome:string, cognome:string){
    this.userSession = new UserSession(uid, email, idAttivita, idUser, token, photoURL, typeLog, displayName, nome, cognome);
    this.saveUserSessionToCookie(this.userSession);
    this.isLoggedInSubject.next(true);
  }

  setIdAttivitaUserSession(id: number) {
    if (this.userSession != null && this.userSession != undefined) {
      this.userSession.idAttivita = id;
      try {
        this.saveUserSessionToCookie(this.userSession);
        this.isLoggedInSubject.next(true);
      } catch (error) {
        console.error('Errore durante il salvataggio della sessione:', error);
      }
    }
  }

  deleteUserSession(){
    this.userSession = null;
    this.deleteUserSessionFromCookie();
    this.isLoggedInSubject.next(false);
  }

  getUser(){
      return this.userSession = this.getUserSessionFromCookie();
  }
  
  apiInsertNewUtente(utente: Utente): Observable<any> {
    return this.http.post<Utente>(`http://192.168.8.130:7253/Soggetto/insert-utente`, utente);
  }

  apiCheckUtenteByProvider(utente: Utente): Observable<any> {
    return new Observable((observer: Observer<Utente>) => {
      this.http.post<Utente>(`http://192.168.8.130:7253/Soggetto/check-utente`, utente)
        .subscribe({
          next: (response: Utente) => {
            observer.next(response);
            observer.complete();
          },
          error: (err: any) => {
            observer.error(err);
          }
        });
    });
  }

  apiCheckUtenteLogin(utente: Utente): Observable<any> {
    return this.http.post<Utente>(`http://192.168.8.130:7253/Soggetto/check-utente`, utente);
  }
}
