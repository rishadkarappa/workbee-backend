export const ResponseMessage = {
    GENERAL: {
        SUCCESS: "Request successfull",
        FAILURE: "Request failed",
        NOT_FOUND: "Resource not found",
        LOGED_OUT:"Logged out successfully"
    },

    TOKEN: {
        REFRESH_TOKEN_IS_REQUIRED:"Refresh token is required",
        TOKEN_REFRESHED:"Token refreshed successfully"
    },

    AUTH: {
        ALREADY_EXISTS: "User already exists",
        USER_NOT_AUTHENTICATED:"User not authenticated",
        WORKER_LOGGED:"Worker logged in successfully"
    },

    USER:{
        REGISTERD_SUCCESSFULLY:"User registered successfully",
        LOGINED_SUCCESFULLY:"User Logined successful",
        VERFIFIED:"user verified successfully",
        SENT_RESET_LINK:"Reset link sent successfully",
        PASSOWORD_UPDATED:"password reset successfully",
        USER_PROFILE_RETRIEVED:'User profile retrieved FROM auth service',
        USER_PROFILES_ARE_RETRIEVED:'User profiles are retrieved FROM auth service'
    },

    ADMIN:{
        LOGINED_SUCCESFULLY:"admin Verified Logined successful",
        GET_USERS:"get suers successfully",
        ADMIN_BLOCKED_USER:'admin blocked this user'
    },

    OTP: {
        SENT: "OTP sent successfully",
        EXPIRED: "OTP expired",
        VERIFIED:"OTP verified successfully",
        INVALID: "Invalid OTP",
        OTP_RESENT:"otp has been resent successfully"
    },
}