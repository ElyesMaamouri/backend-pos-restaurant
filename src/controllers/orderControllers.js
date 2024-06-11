const Order = require("../models/Order");
const Table = require("../models/Table");

const orderSchemaValidation = require("../validation/orderValidation");
const _ = require("lodash");

exports.createOrder = async (req, res, next) => {
  try {
    const tableNumber = req.params.id;
    const table = await Table.findOne({ tableNumber }).populate("order");

    if (!table) {
      return res.status(404).json({ message: "La table n'existe pas" });
    }

    let existingOrder = table.order.find((order) => order.status === "unpaid");
    let order;
    if (!existingOrder) {
      // S'il n'y a pas de commande non payée existante, créez-en une nouvelle
      const newOrder = new Order({
        user: req.body.user,
        products: req.body.products,
        status: req.body.status,
        paymentMethod: req.body.paymentMethod,
        total: req.body.total,
      });

      await newOrder.save();
      table.order = newOrder._id; // Mettre à jour la référence de l'ordre dans la table
    } else {
      // S'il y a une commande non payée existante, ajoutez les nouveaux produits à cette commande
      existingOrder.products.push(...req.body.products);
      existingOrder.total += req.body.total;
      order = await existingOrder.save();
    }

    // Enregistrez la table mise à jour dans la base de données
    await table.save();
    return res.status(201).json({
      message: "Commande a été créée ou mise à jour avec succès",
      order,
    });
  } catch (error) {
    next();
    return res.status(500).json({
      error: error.message,
    });
  }
};

// exports.createOrder = async (req, res, next) => {
//   try {
//     const tableNumber = req.params.id;
//     const newOrder = new Order(
//       _.pick(req.body, ["user", "items", "status", "paymentMethod", "total"])
//     );
//     await orderSchemaValidation.validate(newOrder, { abortEarly: false });
//     const table = await Table.findOne({ tableNumber });
//     if (!table) {
//       return res.status(404).json({ message: "La table n'existe pas" });
//     }
//     if (table.order.includes(newOrder._id)) {
//       return res
//         .status(400)
//         .json({ message: "La commande existe déjà dans la table" });
//     }
//     const savedOrder = await newOrder.save();
//     table.order.push(savedOrder._id);
//     // Enregistrez la table mise à jour dans la base de données
//     await table.save();
//     return res.status(201).json({
//       message: "Commande  a été creé",
//     });
//   } catch (error) {
//     next();
//     return res.status(500).json({
//       error: error.message,
//     });
//   }
// };

exports.displayOrders = async (req, res, next) => {
  try {
    const allOrders = await Order.find();

    return res.status(200).json({
      message: "Liste des commandes",
      listOrders: allOrders,
    });
  } catch (error) {
    next();
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    console.log(req.body);
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    order.status = req.body.status;

    await order.save();

    return res.status(200).json({ message: "Éléments mis à jour avec succès" });
  } catch (error) {
    next(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.displaySpecificOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const fetchOrder = await Order.findById({ _id: orderId }).populate({
      path: "products",
      populate: {
        path: "product",
        model: "Product",
      },
    }).populate('user');

  
    if (!fetchOrder) {
      return res.status(404).json({
        message: "Acune commande à afficher",
      });
    }
    res.status(200).json({
      message: "Details de commande",
      detailsOrder: fetchOrder,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Remove a product from  any order
exports.removeProductFromOrder = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    console.log("id de produit", productId);
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const productIndex = order.products.findIndex((product) => {
      console.log(product._id);
      return product._id.toString() === productId;
    });

    console.log(productIndex);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in order" });
    }

    // Remove the product
    order.products.splice(productIndex, 1);

    // Recalculate the total order price
    order.total = order.products.reduce(
      (acc, product) => acc + product.totalPrice,
      0
    );

    await order.save();

    res.status(200).json({ message: "Product removed from order", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getDetailsofOrders = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Définir l'heure à 00:00:00 aujourd'hui
    let totalUnpaid = 0;
    let totalPaid = 0;
    let countPaid = 0;
    let countUnpaid = 0;
    console.log(today);
    const orders = await Order.find({ createdAt: { $gte: today } }).populate(
      "user"
    );
    if (!orders || orders.length === 0) {
    return res.status(200).json({
      totalUnpaid : 0,
      totalPaid : 0,
      countPaid : 0,
      countUnpaid : 0,
      orderTotalNumber : 0
    })
    }
    let orderTotalNumber = orders.length;
    orders.map((order) => {
      if(order.status === "unpaid") {
        totalUnpaid += order.total;
        countUnpaid++
      } else if(order.status === "paid") {
        totalPaid += order.total;
        countPaid++
      }
    })

    res.status(200).json({
      totalUnpaid : totalUnpaid,
      totalPaid : totalPaid,
      countPaid : countPaid,
      countUnpaid : countUnpaid,
      orderTotalNumber : orderTotalNumber
    })
  } catch (error) {
    next(error);
  }
};
