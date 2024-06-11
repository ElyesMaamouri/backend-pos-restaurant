const Table = require("../models/Table");
const _ = require("lodash");
const generatePDF = require("../utils/printTicket");

 
exports.createTable = async (req, res, next) => {
  try {
    // Trouver le numéro de table le plus élevé existant dans la base de données
    const highestTableNumber = await Table.findOne({}, { tableNumber: 1 }).sort(
      { tableNumber: -1 }
    );
    // Générer le nouveau numéro de table en ajoutant 1 au plus élevé existant
    const newTableNumber = highestTableNumber
      ? highestTableNumber.tableNumber + 1
      : 1;
    const newTable = new Table({
      tableNumber: newTableNumber,
      tableStatus: "not reserved",
    });
    await newTable.save();
    return res
      .status(201)
      .json({ message: "Table créée avec succès", table: newTable });
  } catch (error) {
    next(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.displayTables = async (req, res, next) => {
  try {
    const fetchedTables = await Table.find().populate("order");
    if (!fetchedTables || fetchedTables.length === 0) {
      return res.status(404).json({
        message: "Aucune table trouvée",
      });
    }
    res.status(200).json({
      message: "Liste des tables",
      tables: fetchedTables,
      status: 200,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.removeTable = async (req, res, next) => {
  try {
    const tableNumberToDelete = req.params.tableNumber;

    const deletedTable = await Table.findOneAndDelete({
      tableNumber: tableNumberToDelete,
    });

    if (!deletedTable) {
      return res.status(404).json({
        message: "La table à supprimer n'existe pas",
      });
    }

    await Table.updateMany(
      { tableNumber: { $gt: tableNumberToDelete } },
      { $inc: { tableNumber: -1 } }
    );

    return res.status(200).json({
      message: "Table supprimée avec succès",
      deletedTable,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateTable = async (req, res, next) => {
  try {
    const tableId = req.params.tableId;
    console.log(tableId);
    const { tableStatus, tableStatusPayment, order } = req.body;

    // Vérifier si la table existe
    const tableToUpdate = await Table.findById({
      _id: tableId,
    });
    if (!tableToUpdate) {
      return res
        .status(404)
        .json({ message: "La table à mettre à jour n'existe pas" });
    }
    // Mettre à jour le statut de la table si fourni
    if (tableStatus === "reserved") {
      tableToUpdate.tableStatus = tableStatus;
    }
    if (tableStatus === "not reserved") {
      tableToUpdate.order = [];
      tableToUpdate.tableStatus = tableStatus;
    }
    // Si un orderId est fourni, ajouter ou supprimer la commande de la table
    if (order) {
      // Vérifier si la commande est déjà présente dans la liste
      const orderIndex = tableToUpdate.order.indexOf(order);

      if (orderIndex !== -1) {
        // Si la commande existe déjà, la supprimer de la liste
        tableToUpdate.order.splice(orderIndex, 1);
      } else {
        // Si la commande n'existe pas, l'ajouter à la liste
        tableToUpdate.order.push(order);
      }
    }
    await tableToUpdate.save();
    return res.status(200).json({
      message: "Table mise à jour avec succès",
      updatedTable: tableToUpdate,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.fetchSpeceficTable = async (req, res, next) => {
  try {
    const idTable = req.params.id;
    console.log(idTable);
    const getSpecificTable = await Table.findById({ _id: idTable }).populate({
      path: "order",
      populate: {
        path: "products.product",
        model: "Product",
      },
    });

    if (!getSpecificTable) {
      return res.status(404).json({
        message: "Table n'existe pas",
      });
    }

    res.status(200).json({
      message: "Détails de table",
      table: getSpecificTable,
    });
  } catch (error) {
    console.log(error);
    next();
  }
};



exports.printInvoice = async (req, res, next) => {
  try {
    const idTable = req.params.id;
    console.log(idTable);
    const getSpecificTable = await Table.findById({ _id: idTable }).populate({
      path: "order",
      populate: {
        path: "products.product",
        model: "Product",
      },
    });

    if (!getSpecificTable) {
      return res.status(404).json({
        message: "Table n'existe pas",
      });
    }
    const pdfBuffer = generatePDF(getSpecificTable.order[0]);
 
  res.setHeader('Content-disposition', 'attachment; filename=order.pdf');
  res.setHeader('Content-type', 'application/pdf');
  res.send(Buffer.from(pdfBuffer));
  
  } catch (error) {
    next(error);
  }
};

 