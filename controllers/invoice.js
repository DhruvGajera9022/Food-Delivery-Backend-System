const Invoice = require("../models/invoice");
const InvoiceDetails = require("../models/invoice_detail");



// To display all invoice
const invoice = async (req, res) => {
    const allData = await getAllInvoice();
    res.render("invoice/invoice", {
        title: "Invoice",
        allData: allData,
    });
}



// Delete invoice
const deleteInvoice = async (req, res) => {
    const id = req.params.id;
    await Invoice.destroy({ where: { id } });
    res.redirect("/invoice");
}



// Get API for invoice
const allInvoices = async (req, res) => {
    try {
        const userId = req.userId;

        const allInvoices = await Invoice.findAll({ where: { user_id: userId } });

        if (!allInvoices) {
            res.json({
                status: true,
                message: "No invoice available",
            });
        }

        // Fetch the details of each invoice and attach it to the invoice
        const invoicesWithDetails = await Promise.all(allInvoices.map(async (invoice) => {
            const invoiceDetails = await InvoiceDetails.findAll({ where: { invoice_id: invoice.id } });
            invoice.dataValues.details = invoiceDetails;
            return invoice;
        }));

        res.json({
            status: true,
            message: "Invoices fetched successfully",
            invoices: invoicesWithDetails,
        });

    } catch (error) {
        res.json({
            status: false,
            message: "Error in invoice API",
        });
    }
}



// Get API for single invoice
const singleInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.id;

        // Fetch the invoice by its ID
        const invoice = await Invoice.findOne({ where: { id: invoiceId } });

        // If invoice is not found
        if (!invoice) {
            return res.json({
                status: false,
                message: "Invoice not found",
            });
        }

        // Fetch the invoice details for the invoice
        const invoiceDetails = await InvoiceDetails.findAll({ where: { invoice_id: invoiceId } });

        res.json({
            status: true,
            invoice: { invoice, invoiceDetails },
        });

    } catch (error) {
        res.json({
            status: false,
            message: "Error in single invoice API",
        });
    }
}



// Fetch invoice
const getAllInvoice = async () => {
    return await Invoice.findAll({
        order: [['id', 'DESC']]
    });
};



module.exports = {
    invoice,
    deleteInvoice,
    allInvoices,
    singleInvoice,
}