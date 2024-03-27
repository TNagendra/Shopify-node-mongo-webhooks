
import ProductModel from "../../utils/models/ProductsModel.js";

const productCreateHandler = async (
  topic,
  shop,
  webhookRequestBody,
  webhookId,
  apiVersion
) => {
  const webhookBody = JSON.parse(webhookRequestBody);

  await ProductModel.create({productId:webhookBody.id,productTitle:webhookBody.title,json:JSON.stringify(webhookBody)})
  .then((data)=>{
    console.log("Product created",data)
  })
};

export default productCreateHandler;

