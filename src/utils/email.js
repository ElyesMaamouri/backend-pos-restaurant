const nodemailer = require("nodemailer");
const transporterEmailing = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "develyes218@gmail.com",
    pass: "gzcegvbswfylemej",
  },
});

  const sendMailToUser = (userEmail, token) => {
  let mailOptions = {
    from: "votre_email@gmail.com",
    to: userEmail,
    subject: "Réinitialisation de mot de passe",
    text: `Pour réinitialiser votre mot de passe, veuillez cliquer sur ce lien : http://localhost:3000/pages/reset-password/${token}`,
  };

  try {
    transporterEmailing.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
        // return res
        //   .status(500)
        //   .json({
        //     message: "Une erreur est survenue lors de l'envoi de l'e-mail",
        //   });
      }
      console.log("E-mail envoyé :", info.response);
    //   res
    //     .status(200)
    //     .json({
    //       message: "Un e-mail de réinitialisation de mot de passe a été envoyé",
    //     });
    });
  } catch (error) {
    console.error(
      "Erreur lors de la demande de réinitialisation de mot de passe :",
      error
    );
    // res
    //   .status(500)
    //   .json({
    //     message: "Une erreur est survenue lors du traitement de votre demande",
    //   });
  }
};

module.exports = sendMailToUser;