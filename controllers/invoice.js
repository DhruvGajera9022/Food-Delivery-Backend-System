const Invoice = require("../models/invoice");
const InvoiceDetails = require("../models/invoice_detail");
const Discount = require("../models/discount");
const Products = require("../models/products");



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
        const baseURL = `${process.env.URL}${process.env.PORT}`;

        // Fetch the invoice by its ID
        let invoice = await Invoice.findOne({ where: { id: invoiceId } });

        // If invoice is not found
        if (!invoice) {
            return res.json({
                status: false,
                message: "Invoice not found",
            });
        }

        // Fetch the discount associated with the invoice
        const discount = await Discount.findOne({ where: { id: invoice.discount_id } });

        // Map the invoice data to the desired structure
        invoice = {
            id: invoice.id,
            transaction_id: invoice.transaction_id,
            discount: discount ? discount.name : null,
            order_date: invoice.order_date,
            total_amount: invoice.total_amount,
            discount_amount: invoice.discount_amount,
            received_amount: invoice.received_amount,
            status: invoice.status,
            extra: invoice.extra,
        };

        // Fetch the invoice details for the invoice
        const invoiceDetails = await InvoiceDetails.findAll({ where: { invoice_id: invoiceId } });

        // Map invoice details to include product details
        const formattedInvoiceDetails = await Promise.all(invoiceDetails.map(async (product) => {
            const products = await Products.findOne({ where: { id: product.product_id } });
            return {
                invoice_id: product.invoice_id,
                product: {
                    name: products.name,
                    image: `${baseURL}/img/productImages/${products.image}`,
                },
                qty: product.qty,
                price: product.price,
            };
        }));

        return res.json({
            status: true,
            invoice: { invoice, invoiceDetails: formattedInvoiceDetails },
        });

    } catch (error) {
        res.json({
            status: false,
            message: "Error in single invoice API",
        });
    }
};





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