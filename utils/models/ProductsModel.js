import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productId: { type: BigInt, required: true},
    productTitle: { type: String, required: true },
    json: { type: JSON, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
