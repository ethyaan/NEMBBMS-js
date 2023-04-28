import fs from 'fs'
import path from 'path'
import logger from './logger'
import sgMail from '@sendgrid/mail'
const filePath = path.join(__dirname, '../email-templates');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class SendGrid {
    constructor(app) {
        this.app = app
        this.sendMailByTemplate = this.sendMailByTemplate.bind(this);
    }

    /**
     * Sends an email.
     * @param {string} subject - The subject of the email.
     * @param {string} body - The body of the email.
     * @param {string[]} emailAddressList - The list of email addresses to send the email to.
     * @param {string} from - The email address to send the email from.
     */
    sendMail = async (subject, body, emailAddressList, from) => {
        const msg = {
            to: emailAddressList,
            from: from || 'no-reply@bounce.lingemy.com',
            subject,
            html: body,
        };

        try {
            await sgMail.sendMultiple(msg)
            logger.success("Mail Sent To :", emailAddressList);
        } catch (error) {
            logger.error("Error In Sending Mail", error);
        }
    }

    // @todo: change to arrow function
    /**
     * send an email by loading one template and fill the values and sending to the recipients
     * @param {string} subject - The subject of the email.
     * @param {string} templateName - The name of the email template.
     * @param {{name: string, value: string}[]} templateTags - The tags to replace in the email template.
     * @param {string[]} emailAddressList - The list of email addresses to send the email to. 
     * @param {string} from - The email address to send the email from.
     */
    sendMailByTemplate = (subject, templateName, templateTags, emailAddressList, from) => {
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
export default (app) => new SendGrid(app);
