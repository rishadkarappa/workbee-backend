export const ErrorMessages = {
    USER:{
            NOT_FOUND:"User not found",
            ALREADY_EXISTS:'User alredy exists',
            INVALID_CREDENTIALS:"Invalid email or passowrd",
            INVALID_PASSWORD:"Invalid password",
            NOT_VERIFIED:"User email is not verified",
            DONT_GET_OTP:'didnt get otp',
            INVALID_OTP:'invalid otp',
            OTP_EXPIRED:"otp expired",
            TOKEN_IS_MISSING:"token is missing",
    },

    AUTH:{
        TOKEN_EXPIRED:"Authentication token expired",
        UNAUTHORIZED:"Unauthorized access",
        ATUH_HEADER_IS_MISSING:"Authorization header is missing",
        INVALID_REFRESH_TOKEN:"invalid refresh token",
        REFRESH_TOKEN_NOT_FOUND:"refresh token not fond"
    },

    ADMIN:{
        ADMIN_NOT_FOUND:"Admin not found proviced email is wrong",
        WRONG_PASSWORD:"provided admin password was wrong"
    },

    GENERAL:{
        SERVER_ERROR:"Something went wrong, Please try again later",
        BAD_REQUEST:"Invalid request",
        NOT_FOUND_OTP:'user not found when sent otp'
    }


}