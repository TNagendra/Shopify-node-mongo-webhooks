/**
 *
 * CUSTOMER_DATA_REQUEST
 *
 */

const customerDataRequest = async (topic, shop, webhookRequestBody) => {
  // Payload
  // {
  //   "shop_id": 123456,
  //   "shop_domain": "store.myshopify.com",
  //   "orders_requested": [
  //     123456,
  //     123456,
  //     123456,
  //   ],
  //   "customer": {
  //     "id": 123456,
  //     "email": "email@email.com",
  //     "phone": "123-123-1231"
  //   },
  //   "data_request": {
  //     "id": 1111
  //   }
  // }
  try {
    console.log(`Handle ${topic} for ${shop}`);
    console.log(webhookRequestBody);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

/**
 *
 * CUSTOMER_REDACT
 *
 */

const customerRedact = async (topic, shop, webhookRequestBody) => {
  // Payload
  // {
  //   "shop_id": 123456,
  //   "shop_domain": "store.myshopify.com",
  //   "customer": {
  //     "id": 123456,
  //     "email": "email@email.com",
  //     "phone": "123-123-1234"
  //   },
  //   "orders_to_redact": [
  //     123456,
  //     123456,
  //     123456
  //   ]
  // }
  try {
    console.log(`Handle ${topic} for ${shop}`);
    console.log(webhookRequestBody);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

/**
 *
 * SHOP_REDACT
 *
 */

const shopRedact = async (topic, shop, webhookRequestBody) => {
  // Payload
  // {
  //   "shop_id": 123456,
  //   "shop_domain": "store.myshopify.com"
  // }
  try {
    console.log(`Handle ${topic} for ${shop}`);
    console.log(webhookRequestBody);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

const createProduct = async (topic, shop, webhookRequestBody) => {
  // Payload
  // The webhookRequestBody should contain the details of the product being created
  try {
    console.log(`Handle ${topic} for ${shop}`);
    console.log(webhookRequestBody);
    // Here you can add your logic to process the product creation webhook
    // For example, you can save the product details to a database, trigger further actions, etc.
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export { createProduct };

export { customerDataRequest, customerRedact, shopRedact };
