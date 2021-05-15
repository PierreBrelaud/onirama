import errorData from './errors.json'

export default {
    getAuthErrorMessage(code) {
        let errorMessage;

        switch (code) {
            case errorData.codeError.invalidEmail:
                errorMessage = errorData.errorMessage.invalidEmail;
                break;
            case errorData.codeError.userNotFound:
                errorMessage = errorData.errorMessage.userNotFound;
                break;
            case errorData.codeError.weakPassword:
                errorMessage = errorData.errorMessage.weakPassword;
                break;
            case errorData.codeError.wrongPassword:
                errorMessage = errorData.errorMessage.wrongPassword;
                break;
            case errorData.codeError.tooManyRequests:
                errorMessage = errorData.errorMessage.tooManyRequests;
                break;
            case errorData.codeError.emailAlreadyUsed:
                errorMessage = errorData.errorMessage.emailAlreadyUsed;
                break;
            case errorData.codeError.fillAllFields:
                errorMessage = errorData.errorMessage.fillAllFields;
                break;
            default:
                errorMessage = errorData.errorMessage.contactAdmin;
                break;
        }
        return errorMessage;
    }
}