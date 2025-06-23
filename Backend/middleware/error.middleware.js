

const error = (err, req, res, next) => {

  

    //! Validation error , these is for the , mistake , error done  by user end 
  

    if (err.name === "ValidationError") {
        err.statusCode = 400,
            err.message = Object.values(err.errors).map((ele) => ele.message)
    }

    //! jsonWebTZokenError
    if (err.name === "JsonWebTokenError") {
        err.statusCode = 401;
        err.message = "Please login again!";
    }

    //! cast to onjectId failed
    //?---> it is bec wrong or inavlid id is given to db
    if (err.name === "CastError") {
        err.statusCode = 400,
            err.message = "Invalid Id, "
    }

    //! global error handeler
    err.message = err.message,
        err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
           errObj: err
    })

}


module.exports = error





