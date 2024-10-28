const Razorpay = require("razorpay");
require("dotenv").config();
const Invoice = require("../models/invoice");


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
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
};


// get the transaction data and generate an invoce
const generateInvoice = async (req, res) => {
    // const data = await sessionHelper.loggedInUserData(req);
    const paymentData = req.body;

    // console.log("Payment Data Received:", paymentData);

    const paymentAllData = await razorpay.payments.fetch(paymentData.razorpay_payment_id);
    // console.log("Payment Data:", paymentAllData);

    const status = paymentAllData.captured ? 1 : 0;

    if (paymentAllData) {
        const isInvoiceGenerated = await Invoice.create({
            user_id: 46,
            transaction_id: paymentAllData.id,
            order_date: new Date(),
            total_amount: paymentAllData.amount / 100,
            status,
        });
        console.log("Invoice generated.");
        console.log(isInvoiceGenerated);
    }

    
};



module.exports = {
    payment,
    generateInvoice,
};
