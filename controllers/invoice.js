const Invoice = require("../models/invoice");



// To display all invoice
const invoice = async (req, res) => {
    const allData = await getAllInvoice();
    res.render("invoice/invoice", {
        title: "Invoice",
        allData: allData,
    });
}



// Fetch invoice
const getAllInvoice = async () => {
    return await Invoice.findAll({
        order: [['id', 'DESC']]
    });
};



module.exports = {
    invoice,
}