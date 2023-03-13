var SibApiV3Sdk = require('sib-api-v3-sdk');

const sendEmail = async (email, subject, text) => {
    try {
        var defaultClient = SibApiV3Sdk.ApiClient.instance;
        var apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY_MAIL_SEND;

        var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = text;
        sendSmtpEmail.sender = {"name":"Diplomski plate","email": process.env.SMTP_USER};
        sendSmtpEmail.to = [{"email": email, "name":"Jane Doe"}];
        sendSmtpEmail.replyTo = {"email": process.env.SMTP_USER,"name":"Diplomski plate"};
        sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
        sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};

        apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        }, function(error) {
            console.log(error)
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendEmail;