export class Utente {
    id:number = 0;
    uid:string | undefined;
    displayName:string | undefined;
    email:string | undefined;
    ipAddress:string = '';
    isEmailLogin:boolean | undefined;
    isGoogleLogin:boolean | undefined;
    isFacebookLogin:boolean | undefined;
    registrationDate:string | undefined;
    lastLoginDate:string | undefined;
    errore:string = '';
  }
  
  export class UserSession {
    constructor(
      public uid : string | undefined,
      public email : string,
      public idAttivita : number,
      public idSoggetto : number,
      public token : string,
      public photoURL?: string,
      public typeLog?: number,
      public displayName?: string,
      public nome?: string,
      public cognome?: string
    ){}
  }
  
  export interface ProfileUser {
    uid: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    token?:string;
    nome?:string;
    cognome?:string;
  }