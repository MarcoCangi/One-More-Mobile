import { FirebaseError } from '@angular/fire/app'
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export const getFireBaseErrorMessage = ({code} : FirebaseError,translate: TranslateService) : string => {
    let message;

switch(code) {
    case 'auth/wrong-password':
        message = translate.instant('ERRORS.WRONG_PASSWORD');
        break;
    case 'auth/user-not-found':
        message = translate.instant('ERRORS.EMAIL_NOT_FOUND');
        break;
    case 'auth/invalid-credential':
        message = translate.instant('ERRORS.INVALID_CREDENTIAL');
        break;
    case 'auth/email-already-in-use':
        message = translate.instant('ERRORS.EMAIL_PRESENT');
        break;
    case 'auth/account-exists-with-different-credential':
        message = translate.instant('ERRORS.ACCOUNT_DIFFERENT_CREDENTIAL');
        break;
    case 'invalid-argument':
        message = translate.instant('ERRORS.DIDNT_WORK');
        break;
    default:
        message = code
    }
    return message;
}