import ProductModel from "../../utils/models/ProductsModel.js";

const productDeleteHandler = async (
  topic,
  shop,
  webhookRequestBody,
  webhookId,
  apiVersion
) => {
  const webhookBody = JSON.parse(webhookRequestBody);
  const productId = webhookBody.id;
 console.log(productId)
  try {
    // Delete the product from the database
    const deletedProduct = await ProductModel.findOneAndDelete({ productId:productId });

    if (deletedProduct) {
      console.log(`Product with ID ${productId} deleted successfully`);
    } else {
      console.log(`Product with ID ${productId} not found`);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    // Handle errors appropriately
  }
};

export default productDeleteHandler;
