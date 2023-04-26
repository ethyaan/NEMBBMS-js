// issue number #7
// @todo: refcator and update is required 

// update all imports 
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../email-templates');
const logger    = require('./logger');
// install and add to package 
const sgMail = require('@sendgrid/mail');

// update this to use config 
sgMail.setApiKey('blablabla');

class SendGrid {
    constructor(app) {
        // Object.assign(this, app);

        // this.sendMailByTemplate = this.sendMailByTemplate.bind(this);
    }

    // change to arrow func
    // write js doc
    async sendMail(subject, body, emailAddressList, from) {
        let msg = {
            to: emailAddressList,
            from: from || 'no-reply@bounce.lingemy.com',
            subject: subject,
            html: body,
        };

        sgMail.sendMultiple(msg).then(data => {
            logger.success('Mail Sent To :', emailAddressList);
        }).catch(err => {
            logger.error('Error In Sending Mail', err);
        });
    }


    // @todo: change to arrow function
    /**
     * send an email by loading one template and fill the values and sending to the recipients
     * @param subject
     * @param templateName
     * @param templateTags
     * @param emailAddressList
     * @param from
     */
    sendMailByTemplate(subject, templateName, templateTags, emailAddressList, from) {
        try {
            templateTags.push({name: '___ASSET_URL', value: this._CONFIG.backendAddress});
            let template = fs.readFileSync(path.join(filePath, `${templateName}.html`));
            template = template.toString();
            templateTags.forEach((tag) => {
                template = template.replace(new RegExp(tag.name, 'g'), tag.value);
            });
            this.sendMail(subject, template, emailAddressList, from);
        } catch (e) {
            logger.error('Error in sending e-mail By Template', e.toString());
        }
    }
}
module.exports = (app) => new SendGrid(app);
