import { Kafka } from "kafkajs";
import nodemailer from "nodemailer";
import dotenv from 'dotenv'

dotenv.config()

export const startSendMailConsumer = async () => {
  try {
    const kafka = new Kafka({
      clientId: "mail-service",
      brokers: [process.env.kafka_Broker || "localhost:9092"],
    });

    const consumer = kafka.consumer({ groupId: "mail-service-group" });

    await consumer.connect();

    const topicName = "send-mail";

    await consumer.subscribe({ topic: topicName, fromBeginning: false });

    console.log(
      "✅ Mail service consumer started , listening for sending mail",
    );

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const { to, subject, html } = JSON.parse(
            message.value?.toString() || "{}",
          );

          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "manoranjanjenamitsy17@gmail.com",
              pass: "vybdsfztvxhdfzva",
            },
          });

          await transporter.sendMail({
            from: "Hireheaven <no-reply>",
            to,
            subject,
            html,
          });

          console.log(`Mail has been sent to ${to}`);
        } catch (error) {
          console.log("failed to send mail", error);
        }
      },
    });
  } catch (error) {
    console.log("failed to start kafka");
  }
};

































































// import { Kafka } from "kafkajs";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// // 1. Initialize the transporter OUTSIDE the loop
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.MAIL_USER, // Use env variables
//     pass: process.env.MAIL_PASS,
//   },
// });

// export const startSendMailConsumer = async () => {
//   try {
//     const kafka = new Kafka({
//       clientId: "mail-service",
//       brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
//     });

//     const consumer = kafka.consumer({ groupId: "mail-service-group" });
//     await consumer.connect();

//     const topicName = "send-mail";
//     await consumer.subscribe({ topic: topicName, fromBeginning: false });

//     console.log("✅ Mail service consumer started, listening for messages...");

//     await consumer.run({
//       eachMessage: async ({ topic, partition, message }) => {
//         const rawValue = message.value?.toString();

//         try {
//           const { to, subject, html } = JSON.parse(rawValue || "{}");

//           // 2. Basic Validation
//           if (!to || !subject || !html) {
//             console.error(
//               "❌ Skipping message: Missing required email fields",
//               { to, subject },
//             );
//             return;
//           }

//           // 3. Use the pre-existing transporter
//           await transporter.sendMail({
//             from: `"Hireheaven" <${process.env.MAIL_USER}>`,
//             to,
//             subject,
//             html,
//           });

//           console.log(`🚀 Mail sent successfully to: ${to}`);
//         } catch (error) {
//           console.error(
//             "❌ Failed to process message or send mail:",
//             error.message,
//           );
//           // In Kafka, you might want to throw error here if you want to retry
//           // but for emails, usually we log and move on to avoid duplicate spam.
//         }
//       },
//     });
//   } catch (error) {
//     console.error("❌ Failed to start Kafka consumer:", error);
//   }
// };



