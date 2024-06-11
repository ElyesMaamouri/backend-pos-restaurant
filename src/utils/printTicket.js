const { jsPDF } = require("jspdf"); 

const generatePDF = (order) => {
    const doc = new jsPDF();
    const restaurantName = "Restaurant Luxe";
    const welcomeMessage = "Bienvenue";
    const thankYouMessage = "Merci pour votre visite et à bientôt!";
    const currentDate = new Date().toLocaleString();
  
    // Logo et en-tête
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(restaurantName, 105, 10, null, null, 'center');
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("27000 Évreux", 105, 18, null, null, 'center');
    doc.text("Caisse", 105, 25, null, null, 'center');
  
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`**${welcomeMessage}**`, 105, 35, null, null, 'center');
  
    doc.setFontSize(10);
    doc.text(`Date d'impression: ${currentDate}`, 20, 45);
  
    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);
  
    // Détails de la commande
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('Liste des produits', 20, 60);
  
    let y = 70;
    order.products.forEach((item) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.product.productName}`, 20, y);
      doc.text(`${item.totalPrice.toFixed(2)} TND`, 180, y, null, null, 'right');
      y += 10;
    });
  
    // Ligne pointillée
    doc.setLineWidth(0.2);
    doc.setDrawColor(200, 200, 200);
    for (let i = 65; i < y; i += 5) {
      doc.line(20, i, 190, i);
    }
  
    // Méthode de paiement et Total
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Méthode de paiement: ${order.paymentMethod}`, 20, y + 10);
    doc.text(`Total: ${order.total.toFixed(2)} TND`, 180, y + 10, null, null, 'right');
  
    // Message de remerciement
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(thankYouMessage, 105, y + 30, null, null, 'center');
  
    // Générer le PDF en tant que buffer
    return Buffer.from(doc.output('arraybuffer'));
  };

  module.exports = generatePDF;