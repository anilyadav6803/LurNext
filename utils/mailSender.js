const nodeMailer = require("nodemailer");


exports.mailSender = async(email , title , body ) => {
    try {

        //make transporter 
        let transporter = nodeMailer.createTransport({
            host : process.env.MAIL_HOST , 
            auth : {
                user : process.env.MAIL_USER,
                PASS :process.env.MAIL_PASS
            }
        })


        //mail send 
        let info = await transporter.sendMail({
            from : "LurNext || Founder - By  Anil yadav",
            to : `${email}`,
            subject : `${title}`,
            html : `${body}`,
        })
        console.log(info)
        return info ;
        
    } catch (error) {
        console.log(error.message)
    }
}