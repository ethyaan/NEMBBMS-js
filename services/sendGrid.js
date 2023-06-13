import fs from "fs";
import path from "path";
import { Logger } from "../common/index.js";
import sgMail from "@sendgrid/mail";
import config from "../config.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const filePath = dirname(fileURLToPath(import.meta.url));

sgMail.setApiKey(config.SENDGRID_API_KEY);

class SendGridClass {
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
      from: from || "no-reply@bounce.lingemy.com",
      subject,
      html: body,
    };

    try {
      await sgMail.sendMultiple(msg);
      Logger.success("Mail Sent To :", emailAddressList);
    } catch (error) {
      Logger.error("Error In Sending Mail", error);
    }
  };

  /**
   * send an email by loading one template and fill the values and sending to the recipients
   * @param {string} subject - The subject of the email.
   * @param {string} templateName - The name of the email template.
   * @param {{name: string, value: string}[]} templateTags - The tags to replace in the email template.
   * @param {string[]} emailAddressList - The list of email addresses to send the email to.
   * @param {string} from - The email address to send the email from.
   */
  sendMailByTemplate = (
    subject,
    templateName,
    templateTags,
    emailAddressList,
    from
  ) => {
    try {
      let template = fs.readFileSync(
        path.join(filePath, `${templateName}.html`)
      );
      template = template.toString();
      templateTags.forEach((tag) => {
        template = template.replace(new RegExp(tag.name, "g"), tag.value);
      });
      this.sendMail(subject, template, emailAddressList, from);
    } catch (e) {
      Logger.error("Error in sending e-mail By Template", e.toString());
    }
  };
}

export const SendGrid = new SendGridClass();
