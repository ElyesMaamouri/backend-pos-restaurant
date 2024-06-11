const Category = require("../models/Category");
const _ = require("lodash");
const categorySchemaValidation = require("../validation/categoryValidation");
const isValidObjectId = require("../validation/idValidation");

exports.createCategory = async (req, res, next) => {
  try {
    const category = new Category(
      _.pick(req.body, ["name", "description", "typeCategorie"])
    );

    const existingCategory = await Category.findOne({ name: category.name });
    if (existingCategory) {
      return res.status(409).json({ message: "Categorie existe déjà" });
    }
    await categorySchemaValidation.validate(category, { abortEarly: false });
    await category.save();
    res.status(201).json({ message: "Categorie créé avec succès" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.listCategory = async (req, res, next) => {
  try {
    console.log("hello");
    const fetchAllCategory = await Category.find();
    if (!fetchAllCategory) {
      return res.status(404).json({ message: "Il n'existe aucun categorie" });
    }
    return res.status(200).json({
      message: "Liste des catégories",
      listOfCategory: fetchAllCategory,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.listCategoryPerType = async (req, res, next) => {
  try {
    const filters = req.query;
    console.log(filters);
    const displayCategoriePerType = await Category.find({
      typeCategorie: filters.typeCategorie,
    });
    if (!displayCategoriePerType) {
      return res.status(404).json({
        message: "No Categorie",
      });
    }

    return res.status(200).json({
      message: "Filter result",
      fetchedCategory: displayCategoriePerType,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.removeCategroy = async (req, res, next) => {
  try {
    const idCategory = req.params.id;
    if (!isValidObjectId(idCategory)) {
      return res.status(403).json({ message: "Id Categorie non valide" });
    }
    const deleteCategory = await Category.findById({ _id: idCategory });
    if (!deleteCategory) {
      return res.status(404).json({ message: "Category n'existe pas" });
    }
    await Category.deleteOne({ _id: idCategory });
    res.status(200).json({ message: "Categorie supprimée avec succès" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const idCategory = req.params.id;
    const updates = _.pick(req.body, ["name", "description", "typeCategorie"]);

    if (!isValidObjectId(idCategory)) {
      return res.status(403).json({ message: "ID de catégorie non valide" });
    }
// console.log(updates)
//     const existingCategoryWithNewName = await Category.findOne({
//       name: updates.name,
//     });
//     if (existingCategoryWithNewName) {
//       return res
//         .status(409)
//         .json({ message: "Le nom de catégorie est déjà utilisé" });
//     }

    const updatedCategory = await Category.findByIdAndUpdate(
      idCategory,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    await categorySchemaValidation.validate(updatedCategory, {
      abortEarly: false,
    });

    res
      .status(201)
      .json({ message: "Catégorie mise à jour avec succès", updatedCategory });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getSpecificCategorie = async (req, res, next) => {
  try {
    const idCategory = req.params.id;
    const fetchSpecificCatgorie = await Category.findById({ _id: idCategory });

    if (!fetchSpecificCatgorie) {
      return res.status(404).json({
        message: "Pas de catégorie à afficher",
      });
    } 
 
    res.status(200).json({
      message: "Categorie Touvée",
      category: fetchSpecificCatgorie,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
