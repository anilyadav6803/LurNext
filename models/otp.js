const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({

    email : {
        type : String ,
        require : true ,
    },
    otp : {
        type : String ,
        require : true ,
    },
    creatAt : {
        type : Date ,
        default : Date.now(),
        expires : 5*60 ,
    }
  
});

//funtion to send verifation email 

async function sendverificationMail(email , otp ){
  try {
    const mailResponse = await mailSender(email , "verifiaction email from LurNext " , otp);
    console.log("Email send successfully " , mailResponse)
  } catch (error) {
    console.log(error.message)
  }
}


// Pre-save hook to generate and send OTP
otpSchema.pre('save', async function (next) {
    const otpInstance = this;
  
    // Generate a random OTP if not provided
    if (!otpInstance.otp) {
      otpInstance.otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    }
  
    try {
      // Send verification email
      await sendverificationMail(otpInstance.email, otpInstance.otp);
      console.log('OTP email sent successfully');
    } catch (error) {
      console.log('Error sending OTP email:', error.message);
      return next(error);
    }
  
    next();
  }); 
module.exports = mongoose.model("otpSchema " , otpSchemaSchema )
