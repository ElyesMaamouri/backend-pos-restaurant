const Product = require("../models/Product");
const Category = require("../models/Category");
const _ = require("lodash");
const productSchemaValidation = require("../validation/productValidation");
const fs = require("fs").promises;
const upload = require("../utils/imageUpload");
const multer = require("multer");

exports.listProduct = async (req, res, next) => {
  try {
    const fetchProducts = await Product.find()
      .populate({
        path: "categories",
        populate: {
          path: "subcategories",
        },
      })
      .populate("categories")
      .populate("subCategories");

    if (!fetchProducts) {
      return res.status(404).json({
        message: "Il n'existe aucun produit",
      });
    }
    return res.status(200).json({
      message: "liste des produits",
      products: fetchProducts,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      error: error,
    });
  }
};

exports.listProductPerCategorie = async (req, res, next) => {
  try {
    // Vérifiez si le paramètre de requête "category" est présent
    if (!req.query.category) {
      return res
        .status(400)
        .json({ message: "Le paramètre 'category' est requis." });
    }
console.log(req.query.category)
    // Récupérez l'ID de la catégorie à partir de son nom
    const category = await Category.findOne({ name: req.query.category });

    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée." });
    }

    // Recherchez les produits associés à cette catégorie
    const products = await Product.find({ categories: category._id }).populate("categories").populate("subCategories");

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun produit trouvé pour cette catégorie."
       
         });
    }

    // Retournez les produits trouvés
    return res
      .status(200)
      .json({ message: "Liste des produits", products: products });
  } catch (error) {
    next(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    upload.single("productImage")(req, res, async function (err) {
      const productData = _.pick(req.body, [
        "productName",
        "productPrice",
        "categories",
        "subCategories",
        "description",
      ]);
      const existingProduct = await Product.findOne({
        productName: productData.productName,
      });

      if (existingProduct) {
        return res.status(409).json({ message: 'Produit existe déjà"' });
      }
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (req.file) {
        productData.productImage = req.file.filename;
        const product = new Product(productData);
        await productSchemaValidation.validate(product, { abortEarly: false });
        await product.save();
        return res.status(201).json({ message: "Produit créé avec succès" });
      } else {
        return res
          .status(400)
          .json({ message: "Aucun fichier n'a été téléchargé" });
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.removeProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productToDelete = await Product.findById({ _id: productId });
    if (!productToDelete) {
      return res.status(404).json({
        message: "Produit n'existe pas",
      });
    }
    if (productToDelete.productImage) {
      await fs.unlink(`uploads/${productToDelete.productImage}`);
    }
    await Product.deleteOne({ _id: productId });
    res.status(200).json({
      message: "Produit supprimée avec succès",
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      error: error,
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    upload.single("productImage")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: "Erreur lors de l'upload de l'image" });
      } else if (err) {
        return res
          .status(400)
          .json({ message: "Erreur lors de l'upload de l'image" });
      }
      const productId = req.params.id;

      const productData = _.pick(req.body, [
        "productName",
        "productImage",
        "productPrice",
        "categories",
        "subCategories",
        "description",
      ]);
      if (req.file) {
        productData.productImage = req.file.filename;
      }

      await productSchemaValidation.validate(productData, {
        abortEarly: false,
      });
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        productData,
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({
          message: "Produit non trouvé",
        });
      }
      return res.status(200).json({
        message: "Produit mis à jour avec succès",
        product: updatedProduct,
      });
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      error: error,
    });
  }
};

exports.getProductUnique = async (req, res, next) => {
  try {
    const idProduct = req.params.id;
    const fetchProductUnique = await Product.findOne({
      _id: idProduct,
    })
      .populate("categories")
      .populate("subCategories");
    if (!fetchProductUnique) {
      return res.status(404).json({
        message: "Porduit Non trouvée",
      });
    }
    res.status(200).json({
      message: "produit trouvée",
      product: fetchProductUnique,
    });
  } catch (error) {
    next(error);
    res.status(500).json({
      error: error,
    });
  }
};
 