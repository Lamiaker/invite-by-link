const Invitation = require("../models/Invitation");
const User = require("../models/User");

exports.sendInvitation = async (req, res) => {
  try {
    const senderId = req.userId;

    // Vérifier si l'utilisateur a le droit d'envoyer une invitation
    const sender = await User.findById(senderId);
    if (!sender || !["admin", "manager"].includes(sender.accountType)) {
      return res.status(403).json({
        message: "Seuls les admins ou managers peuvent générer des invitations.",
      });
    }

    // Générer un code aléatoire à 6 chiffres
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 10 * 60 * 1000; // Expire dans 10 minutes

    // Sauvegarder l'invitation dans la base de données
    const invitation = await Invitation.create({
      sender: senderId,
      verificationCode,
      expiresAt,
    });

    // Construire le lien d'invitation
    const signupLink = `http://votre-app.com/signup?code=${verificationCode}`;

    res.status(201).json({
      message: "Invitation générée avec succès.",
      link: signupLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la génération de l'invitation.",
      error,
    });
  }
};