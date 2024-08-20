const jwt = require("jsonwebtoken");
require("dotenv").config();
const user = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer", "");

    //if token is missing
    if (!token) {
      return res.status(401).json({
        succes: false,
        message: "token is missing",
      });
    }

    //verify the token
    try {
      const decode =  jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        succes: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
        succes : false,
        message : "something went wrong while validating" ,

    });
  }
};

//isAdmin
exports.isAdmin = async(req ,res , next) =>{
    try {
        if(req.user. accountType !== "isAdmin"){
            return res.status(401).json({
                succes : false,
                message : "this is protected routes for isAdmin only " ,
        
            }); 
        }
        
    } catch (error) {
        return res.status(401).json({
            succes : false,
            message : "something went wrong while validating" ,
    
        });
    }
}
//isStudent
exports.Student = async(req ,res , next) =>{
    try {
        if(req.user. accountType !== "student"){
            return res.status(401).json({
                succes : false,
                message : "this is protected routes for student only " ,
        
            }); 
        }
        
    } catch (error) {
        return res.status(401).json({
            succes : false,
            message : "something went wrong while validating" ,
    
        });
    }
}

//isInstructor
exports.instructor = async(req ,res , next) =>{
    try {
        if(req.user. accountType !== "instructor"){
            return res.status(401).json({
                succes : false,
                message : "this is protected routes for instructor only " ,
        
            }); 
        }
        
    } catch (error) {
        return res.status(401).json({
            succes : false,
            message : "something went wrong while validating" ,
    
        });
    }
}