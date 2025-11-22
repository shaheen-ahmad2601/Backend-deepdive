class ApiResponse {
    constructor(statusCode, message = "success", data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = true;
        this.data = data;
    }   
}
/*
Purpose of ApiResponse
It’s a standardized success response wrapper for your API.
Instead of returning random JSON shapes like:
You enforce one predictable response structure for every successful API call.
This is extremely useful for frontends and debugging.

Because without it, APIs become inconsistent and messy.
❌ Without a response wrapper:
Different devs return different shapes:
{ user }
{ data: user }
{ success: true }
{ message: "ok" }
This kills frontend consistency.

These two classes are a matched pair:
ApiError → for failures
ApiResponse → for success
They ensure all responses follow the same contract, which is good API design.
*/