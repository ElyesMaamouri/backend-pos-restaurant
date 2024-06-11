const User = require("../models/User");
const _ = require("lodash");
const crypto = require('crypto-js');
const bcrypt = require("bcrypt");
const sendMailToUser = require('../utils/email');
const constants = require("../config/constants");
const {
  userSchemaValidation,
  loginSchemaValidation,
} = require("../validation/userValidation");
const jwt = require("jsonwebtoken");
const isValidObjectId = require("../validation/idValidation");

exports.createUser = async (req, res, next) => {
  try {
    const newUser = new User(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "password",
        "role",
        "workRangeHours",
      ])
    );
    const checkexistingUser = await User.findOne({ email: newUser.email });
    if (checkexistingUser) {
      return res.status(409).json({
        message: "Utilisateur existe déja",
      });
    }
    try {
      await userSchemaValidation.validate(newUser, { abortEarly: false });
    } catch (validationError) {
      console.log(validationError)
      const errors = validationError.errors;
      return res.status(400).json({ errors });
    }
    const hashedPassword = await bcrypt.hash(newUser.password, constants.salt);
    newUser.password = hashedPassword;
    await newUser.save();
    return res.status(201).json({
      message: "Utilisateur créé avec succès",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(403).json({ message: "Id utilisateur non valide" });
    }

    const deleteUser = await User.findById({ _id: userId });
    if (!deleteUser) {
      return res.status(404).json({
        message: "Utilisateur n'existe pas",
      });
    }

    await User.deleteOne({
      _id: userId,
    });

    await res
      .status(200)
      .json({ message: "Utilisateur à été supprimer avec succès" });
  } catch (error) {
    next(error);
    return res.status(500).json({
      message: error,
    });
  }
};

exports.dispalyUser = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({
        message: "Aucun utilisateur pour moment enregistrer",
      });
    }
    return res.status(200).json({
      message: "List des employés",
      employee: users,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      message: error,
    });
  }
};

exports.displayUserPerRole = async (req, res, next) => {
  try {
    const queryRole = req.query.role;
    const user = await User.find({ role: queryRole });
    if (!user) {
      return res.status(404).json({
        message: "il nexiste aucun utilsateur avec ce role",
      });
    }
    res.status(200).json({
      user: user,
      message: "liste des utilisateurs",
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      message: "erreure interne de serveur",
    });
  }
};

exports.getSpecificUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(403).json({ message: "Id utilisateur non valide" });
    }

    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "utilisateur n'existe pas",
      });
    }

    // Exclure le champ du mot de passe de l'objet utilisateur
    const { password, ...userData } = user.toObject();

    return res.status(200).json({
      message: "Utilisateur trouvé",
      user: userData,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      message: error,
    });
  }
};


exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ message: "Identifiant d'utilisateur non valide" });
    }

    let userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    const { email, password } = req.body;

    if(email !== userToUpdate.email) {
      const testExistingUser =await User.findOne({email});
      if (testExistingUser) {
        return res.status(409).json({ message: "Cet email est déjà utilisé" });
      }
    }
 
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      userToUpdate.password = hashedPassword;
    }

    // if (password) {
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   userToUpdate.password = hashedPassword;
    // }

    const fieldsToUpdate = _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "role",
      "workRangeHours",
    ]);
    Object.assign(userToUpdate, fieldsToUpdate);

    await userToUpdate.save();

    return res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user: userToUpdate,
    });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la mise à jour de l'utilisateur :",
      error
    );
    return res
      .status(500)
      .json({ message: "Une erreur interne du serveur s'est produite" });
  }
};

exports.loginUser = async (req, res, next) => {
  console.log("body login", req.body)
  try {
   
    const client = new User(_.pick(req.body, ["email", "password"]));
    try {
      // Testez form
      await loginSchemaValidation.validate(client, { abortEarly: false });
    } catch (validationError) {
      // Récupérez les erreurs de validation
      const errors = validationError.errors;
      return res.status(400).json({ message: errors });
    }
    const checkExistingUser = await User.findOne({ email: client.email });
    if (!checkExistingUser) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe non valide" });
    }
    const isPasswordValid = await bcrypt.compare(
      client.password,
      checkExistingUser.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe non valide" });
    }

    const token = jwt.sign(
      { userId: checkExistingUser._id, role: checkExistingUser.role, firstName : checkExistingUser.firstName, lastName :checkExistingUser.lastName  },
      constants.secretKeyToken,
      {
        expiresIn: constants.expireToken,
      }
    );
    return res.status(200).json({ message: "Connexion réussie", token: token });
  } catch (errors) {
    console.error(errors);
    next(errors);
  }
};


exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    console.log(email)
    const user = await User.findOne({email : email});
    if (!user) {
      return res.status(404).json({
        message : 'Utilisateur non trouvée'
      })
    }
   
    const token = crypto.lib.WordArray.random(20).toString();
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // 1 heure
    await user.save();
    res.status(201).json({
      message : 'Le lien de réinitialisation du mot de passe a été envoyé'
    })
    sendMailToUser(user.email, token);
  } catch(error) {
    res.status(500).json({ message: 'Une erreur est survenue lors de la réinitialisation du mot de passe' });
    next(error)
 
  }
}


exports.resetPassword = async (req, res, next) => {
  try {
const  {token ,newPassword} = req.body;
 
const user = await User.findOne({
  resetToken : token,
  resetTokenExpires: { $gt: Date.now() }
});
if(!user) {
  return res.status(400).json({
    message : 'Token expiré'
  })
}
user.password = await bcrypt.hash(newPassword, constants.salt);
user.resetToken = undefined;
user.resetTokenExpires = undefined;
await user.save();
return res.status(201).json({
  message : 'Mot de passe réinitialisé avec succès'
})
  }catch(error) {
    res.status(500).json({ message: 'Une erreur est survenue lors de la réinitialisation du mot de passe' });
    next(error)
  }
}