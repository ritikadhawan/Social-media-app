//creating worker for queue that contains emails (job) for new comment
const queue = require('../config/kue');
const commentsMailer = require('../mailers/comments_mailer');
//process function
queue.process('emails',function(job, done) {
    console.log(`email worker is processing the job`);
    commentsMailer.newComment(job.data);
    done(); 
});