const Razorpay = require("razorpay");
require("dotenv").config();
const Invoice = require("../models/invoice");
const productModel = require("../models/products");
const invoiceDetailsModel = require("../models/invoice_detail");
const Address = require("../models/address");


// Razorpay key and secret
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Take value from frontend and generate order and send order-id to frontend
const payment = async (req, res) => {

    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: "receipt#1",
        payment_capture: 1,
    };

    try {
        const response = await razorpay.orders.create(options);
        // console.log(response);
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
};


// get the transaction data and generate an invoice
const generateInvoice = async (req, res) => {
    const paymentData = req.body;
    const cartItems = paymentData.cartItems;
    const address_id = paymentData.address_id;

    // console.log("Payment Data: ", paymentData);

    const paymentAllData = await razorpay.payments.fetch(paymentData.payment_id);
    console.log("Payment Data:", paymentAllData);

    // Fetch selected address
    const address = await Address.findOne({ where: { id: address_id } });

    const addressString = `${address.fullName}, ${address.number}, ${address.type}, ${address.no}, ${address.street}, ${address.city}, ${address.state}, ${address.country}-${address.zipCode}`;

    const status = paymentAllData.captured ? 1 : 0;

    if (paymentAllData) {
        const isInvoiceGenerated = await Invoice.create({
            user_id: req.userId,
            transaction_id: paymentAllData.id,
            order_date: new Date(),
            total_amount: paymentAllData.amount / 100,
            status,
            address: addressString
        });

        console.log("Invoice generated.");
        const invoiceId = isInvoiceGenerated.id;

        if (isInvoiceGenerated) {
            handleInvoiceDetails(cartItems, invoiceId);
        }

        // Send the invoice ID in the response
        return res.json({
            status: true,
            message: "Invoice generated successfully.",
            invoiceId: invoiceId
        });
    }

    return res.json({
        status: false,
        message: "Payment data not found.",
    });
};



// Generate invoice details
const handleInvoiceDetails = async (cartItems, invoiceId) => {
    const separatedItems = Object.entries(cartItems).map(([id, quantity]) => {
        return {
            productId: id,
            quantity: quantity
        };
    });

    // console.log("Separated Items: ", separatedItems);

    try {
        const processedOrder =
            separatedItems.map(async (item) => {
                const product = await productModel.findOne({
                    where: { id: item.productId }
                });
                const price = product.price;

                const newInvoiceDetail = await invoiceDetailsModel.create({
                    invoice_id: invoiceId,
                    product_id: item.productId,
                    qty: item.quantity,
                    price: price,
                });

                return newInvoiceDetail;
            })
    } catch (error) {
        console.error("Error while handling invoice details:", error);
    }


}



module.exports = {
    payment,
    generateInvoice,
};
