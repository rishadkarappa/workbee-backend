/**
 * Change Client Password Reqeust DTO
 */
export interface ChangePasswordReqDTO {
    userId : string;
    currentPassword : string;
    newPassword : string;
}


/**
 * Change Client Passowrd Response DTO
 */
export interface ChangePasswordResponseDTO {
    isChanged : boolean
}