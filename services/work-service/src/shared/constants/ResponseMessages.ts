export const ResponseMessage = {
    GENERAL: {
        SUCCESS: "Request successfull",
        FAILURE: "Request failed",
        NOT_FOUND: "Resource not found",
    },

    AUTH: {
        ALREADY_EXISTS: "Worker already exists",
        BLOCKED_WORKER:"Blocked worker",
    },

    WORKER:{
        APPLIED:"Worker applied successfully!",
        REGISTERD_SUCCESSFULLY:"Worker registered successfully",
        GET_ALL_APPLIERS:"Successfully fetched all appliers",
        DONT_GET_APPLIERS:"didt get newappliers in getusecase leryer",
        WORKER_ASSIGNED_WORK_RETRIEVED:"Worker assigned works retrieved successfully",
        WORKER_PROFILE_RETRIEVED:'Worker profiles retrieved',
        WORKER_PROFILE_RETRIEVED_BATCH:'Worker profiles retrieved BATCH'
    },
    WORK:{
        WORK_STATUS_UPDATED:"Worker status updated successfully",
        WORK_BOOKED:"Task booked successfully",
        RETRIEVED_WORKS:"Successfully retrieved user works",
        WORK_UPDATED:"Work updated successfully",
        WORK_DELETED:"Work deleted successfully",
    }
   
}