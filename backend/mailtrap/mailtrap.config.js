const { MailtrapClient } = require("mailtrap");
const dotenv=require("dotenv");
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "NotesMaker",
};

module.exports={mailtrapClient,sender}
