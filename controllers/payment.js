const Razorpay = require("razorpay");
require("dotenv").config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const payment = async (req, res) => {

    const options = {
        amount: req.body.amount * 100,
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

const logPayment = async (req, res) => {
    const paymentData = req.body;

    console.log("Payment Data Received:", paymentData);

    const paymentAllData = await razorpay.payments.fetch(paymentData.razorpay_payment_id);
    console.log('Payment Data:', paymentAllData);

}


module.exports = {
    payment,
    logPayment,
};
