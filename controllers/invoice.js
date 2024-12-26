const Invoice = require("../models/invoice");
const InvoiceDetails = require("../models/invoice_detail");
const Discount = require("../models/discount");
const Products = require("../models/products");
const Address = require("../models/address");
const User = require("../models/user");



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
                status: false,
                message: "No invoice available",
            });
        }

        // Fetch the details of each invoice and attach it to the invoice
        const invoicesWithDetails = await Promise.all(allInvoices.map(async (invoice) => {
            const invoiceDetails = await InvoiceDetails.findAll({ where: { invoice_id: invoice.id } });
            return {
                id: invoice.id,
                transaction_id: invoice.transaction_id,
                discount: invoice.discount,
                order_date: invoice.order_date,
                total_amount: invoice.total_amount,
                discount_amount: invoice.discount_amount,
                received_amount: invoice.received_amount,
                status: invoice.status,
                extra: invoice.extra,
                details: invoiceDetails,
            };
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
        const invoiceData = await Invoice.findOne({ where: { id: invoiceId } });

        // If invoice is not found
        if (!invoiceData) {
            return res.status(404).json({
                status: false,
                message: "Invoice not found",
            });
        }

        // Fetch the discount associated with the invoice
        const discount = await Discount.findOne({ where: { id: invoiceData.discount_id } });

        // Format the invoice data
        const formattedInvoice = {
            id: invoiceData.id,
            transaction_id: invoiceData.transaction_id,
            discount: discount ? discount.name : null,
            order_date: invoiceData.order_date,
            total_amount: invoiceData.total_amount,
            discount_amount: invoiceData.discount_amount,
            received_amount: invoiceData.received_amount,
            status: invoiceData.status,
            extra: invoiceData.extra,
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
                    image: `${process.env.URL}/img/productImages/${products.image}`,
                },
                qty: product.qty,
                price: product.price,
            };
        }));

        const invoiceAddress = {
            fullName: invoiceData.address.split(", ")[0],
            number: invoiceData.address.split(", ")[1],
            type: invoiceData.address.split(", ")[2],
            address: invoiceData.address.split(", ").slice(3).join(", "),
        }

        // Return the formatted response
        return res.json({
            status: true,
            invoice: {
                ...formattedInvoice,
                invoiceDetails: formattedInvoiceDetails,
                address: invoiceAddress,
            },
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