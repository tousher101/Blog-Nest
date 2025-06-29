const {Resend} = require('resend');
const resetPasswordTemplate =require('./resetPassTemp');
const resend = new Resend(process.env.EMAIL_VERIFICATION_API);
const APIURI=process.env.MAIN_SERVER_URL
const forgetEmail = async(email, name, tokenReset)=>{
    
    const resetLink =`${APIURI}/api/auth/reset-password/${tokenReset}`;
    try{
        const {data,erro}= await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Reset Password',
            html: resetPasswordTemplate(name,resetLink),
        });
        return true


    }catch(error){console.error('Unexpected Error')}
};
module.exports = forgetEmail