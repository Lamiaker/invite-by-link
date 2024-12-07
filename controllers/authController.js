const Invitation = require("../models/Invitation");
const User = require("../models/User");

exports.signup = async (req, res) => {
  const { code, userName, fullName, password , email} = req.body;

   try {
     // Rechercher l'invitation via le code
     const invitation = await Invitation.findOne({ verificationCode: code });

     if (!invitation) {
       return res.status(400).json({
         message: "Code de vérification invalide ou invitation introuvable.",
       });
     }

     // Vérifier si le code a déjà été utilisé
     if (invitation.status === "used") {
       return res
         .status(400)
         .json({ message: "Ce code d'invitation a déjà été utilisé." });
     }

     // Vérifier si l'invitation a expiré
     if (invitation.expiresAt < Date.now()) {
       invitation.status = "expired";
       await invitation.save();
       return res.status(400).json({ message: "Code de vérification expiré." });
     }

     // Vérifier si l'utilisateur existe déjà par email ou nom d'utilisateur
     const existingUser = await User.findOne({
       $or: [{ email: invitation.email }, { userName }],
     });

     if (existingUser) {
       return res.status(400).json({
         message:
           "Un utilisateur avec cet email ou nom d'utilisateur existe déjà.",
       });
     }

     // Créer un nouvel utilisateur
     const user = await User.create({
       email,
       userName,
       fullName,

       password,
       accountType: "reseller",
       parent: invitation.sender, // Associer au parent (l'expéditeur)
     });

     // Marquer l'invitation comme "utilisée"
     invitation.status = "used";
     await invitation.save();

     res.status(201).json({ message: "Compte créé avec succès.", user });
   } catch (error) {
     res.status(500).json({ message: "Erreur lors de l'inscription.", error });
   }
};
