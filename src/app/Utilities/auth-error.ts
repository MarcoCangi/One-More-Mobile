import { FirebaseError } from '@angular/fire/app'

export const getFireBaseErrorMessage = ({code} : FirebaseError) : string => {
    let message;

switch(code) {
    case 'auth/wrong-password':
        message = 'La password non è corretta'
        break;
    case 'auth/user-not-found':
        message = 'email non trovata'
        break;
    case 'auth/invalid-credential':
        message = 'credenziali non valide'
        break;
    case 'auth/email-already-in-use':
        message = 'email già presente'
        break;
    case 'auth/account-exists-with-different-credential':
        message = 'esiste già un account con credenziali diverse'
        break;
    case 'invalid-argument':
        message = 'qualcosa non ha funzionato'
        break;
    default:
        message = code
    }
    return message;
}