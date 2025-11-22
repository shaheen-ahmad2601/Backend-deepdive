class ApiResponse {
    constructor(statusCode, message = "success", data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = true;
        this.data = data;
    }   
}