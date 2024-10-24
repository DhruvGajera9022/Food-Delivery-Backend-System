const stripe = require("stripe")(process.env.STRIPE_SECRET);
require("dotenv").config();


const makePayment = async (req, res) => {
    const { products } = req.body;
    console.log(products);

    const lineItems = products.map((product) => ({
        price_data: {
            currency: process.env.STRIPE_CURRENCY,
            product_data: {
                name: product.name,
            },
            unit_amount: product.price * 100,
        },
        quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: "payment",
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL
    });

    res.json({ id: session.id });

}


module.exports = {
    makePayment,
}