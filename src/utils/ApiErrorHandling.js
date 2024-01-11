class ApiErrHandling extends Error { // Error is a built in class in javascript which is used to handle errors (Node.js Error Handling)
  constructor( 
    message="Something went wrong", // default message
    statusCode, 
    errors = [], // default errors
    stack = ""
    ){
    super(message); // super is used to call the constructor of the parent class
    // super changes the context of this keyword to the parent class
    this.statusCode = statusCode; 
    this.errors = errors; // errors is an array of objects
    this.success = false;
    this.data=null // data is used to send the data to the client. i.e. the data which is requested by the client is going to be NULL obviously Its an error

    if(stack){
        this.stack = stack // stack is used to show the error stack
    }
    else{
        Error.captureStackTrace(this, this.constructor); // Error.captureStackTrace is used to capture the stack trace of the error. It's argumenets are (this, this.constructor) which means (this, ApiErrHandling) 
    }
  } // {} is used changes to the original object of the class
}

export default ApiErrHandling;