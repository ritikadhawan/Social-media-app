const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment)=>{
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: '',
        to: comment.user.email,
        subject: "New Comment published",
        html: htmlString
    },(err, info)=>{
        if(err){
            console.log(`${err} in sending mail`);
            return;
        }
        console.log(`message sent ${info}`);
        return;
    });
}
