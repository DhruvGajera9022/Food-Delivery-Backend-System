const invoiceDetailsModel = require("../models/invoice_detail");
const productModel = require("../models/products");



const getInvoiceDetails = async (req, res) => {
    try {
        const { invoice_id } = req.params;

        // Fetch invoice details by invoice_id
        const invoiceDetails = await invoiceDetailsModel.findAll({
            where: { invoice_id: invoice_id },
        });

        const detailedInvoice = await Promise.all(
            invoiceDetails.map(async (detail) => {
                const product = await productModel.findOne({
                    where: { id: detail.product_id },
                    attributes: ['name', 'image', 'price'],
                });

                return {
                    ...detail.toJSON(),
                    productName: product?.name,
                    productImage: product?.image,
                };
            })
        );

        res.json(detailedInvoice);
    } catch (error) {
        console.error("Error fetching invoice details:", error);
        res.status(500).json({ error: "Failed to fetch invoice details" });
    }
};



module.exports = {
    getInvoiceDetails,
};
