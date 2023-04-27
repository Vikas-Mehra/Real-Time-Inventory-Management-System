const inventoryModel = require("../models/inventoryModel");

const {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  isValidPrice,
  isValidQuantity,
} = require("../util/validator");

//-------------------------------------------------------------------------
//                        1. API - POST /inventory
//              (Create a product document from request body.)
//-------------------------------------------------------------------------

const createProduct = async (req, res) => {
  try {
    console.log("\n Create Product API.");
    console.log("\n", req.body);

    if (!isValidRequestBody(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    // Destructuring Request-Body.
    let { title, description, price, quantity } = req.body;

    // <Title> of Product can be any Characters.
    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: "<title> is required." });
    }

    // <description> Validation.
    if (!isValid(description)) {
      return res
        .status(400)
        .send({ status: false, message: "<description> is required." });
    }

    // <price> Validation.
    if (!isValid(price)) {
      return res
        .status(400)
        .send({ status: false, message: "<price> is required." });
    }
    if (!isValidPrice(price)) {
      return res.status(400).send({
        status: false,
        message:
          "<price> should be Numbers only: max- 8-digits-Integers. NOT Start with <0>. And IF decimal, then 2-digit dicimal only.",
      });
    }

    // <quantity> Validation.
    if (!isValid(quantity)) {
      return res
        .status(400)
        .send({ status: false, message: "<quantity> is required." });
    }
    if (!isValidQuantity(quantity)) {
      return res.status(400).send({
        status: false,
        message: "<quantity> should be Numbers only, and greater than <0>.",
      });
    }
    quantity = Math.floor(quantity); // "quantity" must be a Whole-Number. Explicit conversion done here.

    let data = { title, description, price, quantity };

    // Create Document.
    const createProduct = await inventoryModel.create(data);

    //- **Response format**
    return res.status(201).send({
      status: true,
      message: "Success",
      data: createProduct,
    });
    // message: "Product created successfully.",
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

/**
 *
 *
 *
 *
 *
 *
 *
 */

//-------------------------------------------------------------------------
//                        2. API - GET /inventory
//        (Returns all products in the collection that aren't deleted.)
//-------------------------------------------------------------------------

const getProducts = async (req, res) => {
  try {
    console.log("\n getProducts API.");

    const filterQuery = { isDeleted: false };

    //- **Response format**
    const documents = await inventoryModel.find(filterQuery);

    //- **On error** - Return a suitable error message with a valid HTTP status code.
    if (!documents.length) {
      return res
        .status(404)
        .send({ status: false, message: "No products found." });
    }

    // message: "Fetched Products Successfully.",
    return res.status(200).send({
      status: true,
      message: "Success",
      data: documents,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

/**
 *
 *
 *
 *
 *
 *
 *
 */

//-------------------------------------------------------------------------
//                        3. API - GET /inventory/:id
//                     (Returns product details by product id)
//-------------------------------------------------------------------------

const getProductById = async (req, res) => {
  //
  console.log("\n Outside TRY - getProductById API.");

  // Allow Origin "*".
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    console.log("\n getProductById API.");

    const productIdParams = req.params.id;
    if (!isValidObjectId(productIdParams)) {
      return res.status(400).send({
        status: false,
        message: `<productId> in Params: <${productIdParams}> NOT a Valid Mongoose Object ID.`,
      });
    }

    // Specific-message.
    const findProduct = await inventoryModel.findById(productIdParams);
    if (!findProduct) {
      return res.status(404).send({
        status: false,
        message: `No Such PRODUCT with ID: <${productIdParams}> exist in Database.`,
      });
    }
    if (findProduct.isDeleted === true) {
      return res.status(404).send({
        status: false,
        message: `PRODUCT with ID: <${productIdParams}> already deleted.`,
      });
    }

    //- **On success** - Return HTTP status 200. Also return the product documents.
    return res.status(200).send({
      status: true,
      message: "Success",
      data: findProduct,
    });
    // message: "Fetched Product by ID.",
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

/**
 *
 *
 *
 *
 *
 *
 *
 */

//----------------------------------------------------------------------------------
//                        4. API - PUT /inventory/:id
//             (Updates a product by changing at least one or all fields.)
//----------------------------------------------------------------------------------

const updateProductById = async (req, res) => {
  try {
    console.log("\n updateProductById API.");

    const productIdParams = req.params.id;
    if (!isValidObjectId(productIdParams)) {
      return res.status(400).send({
        status: false,
        message: `<productId> in Params: <${productIdParams}> NOT a Valid Mongoose Object ID.`,
      });
    }

    //- Check if the productId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body.
    const productExist = await inventoryModel.findOne({
      _id: productIdParams,
      isDeleted: false,
    });
    if (!productExist) {
      return res.status(404).send({
        status: false,
        message: `No Such PRODUCT with ID: <${productIdParams}> exist in Database(OR already deleted).`,
      });
    }

    console.log("\n", req.body);

    if (!isValidRequestBody(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    let flag_NoDataGiven = true;

    // Destructuring Request-Body.
    let { title, description, price, quantity } = req.body;

    // <title> Validation.
    if (typeof title != "undefined" && title.length > 0) {
      if (!isValid(title)) {
        return res
          .status(400)
          .send({ status: false, message: "<title> is Invalid." });
      }

      flag_NoDataGiven = false;
      productExist.title = title;
    }

    // <description> Validation.
    if (typeof description != "undefined" && description.length > 0) {
      if (!isValid(description)) {
        return res
          .status(400)
          .send({ status: false, message: "<description> is Invalid." });
      }

      flag_NoDataGiven = false;
      productExist.description = description;
    }

    // <price> Validation.
    if (typeof price != "undefined" && price.length > 0) {
      if (!isValid(price)) {
        return res
          .status(400)
          .send({ status: false, message: "<price> is Invalid." });
      }
      if (!isValidPrice(price)) {
        return res.status(400).send({
          status: false,
          message:
            "<price> should be Numbers only: max- 8-digits-Integers. NOT Start with <0>. And IF decimal, then 2-digit dicimal only.",
        });
      }

      flag_NoDataGiven = false;
      productExist.price = price;
    }

    // <quantity> Validation.
    if (typeof quantity != "undefined" && quantity.length > 0) {
      if (!isValid(quantity)) {
        return res
          .status(400)
          .send({ status: false, message: "<quantity> is Invalid." });
      }
      if (!isValidQuantity(quantity)) {
        return res.status(400).send({
          status: false,
          message: "<quantity> should be Numbers only, and greater than <0>.",
        });
      }
      quantity = Math.floor(quantity); // "quantity" must be a Whole-Number. Explicit conversion done here.

      flag_NoDataGiven = false;
      productExist.quantity = quantity;
    }

    if (flag_NoDataGiven) {
      return res.status(400).send({
        status: false,
        message: "Please fill atleast one field for updation.",
      });
    }

    // Update the Product-document.
    const updateProduct = await inventoryModel.findOneAndUpdate(
      { _id: productIdParams, isDeleted: false },
      productExist,
      { new: true }
    );

    //- **Response format**
    //- **On success** - Return HTTP status 200. Also return the updated product document.
    // message: "Product Updated.",
    return res.status(200).send({
      status: true,
      message: "Success",
      data: updateProduct,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

/**
 *
 *
 *
 *
 *
 *
 *
 */

//-------------------------------------------------------------------------
//                  5. API - DELETE /inventory/:id
//        (Deletes a product by product id if it's not already deleted.)
//-------------------------------------------------------------------------

const deleteProductById = async (req, res) => {
  try {
    console.log("\n deleteProductById API.");

    const productIdParams = req.params.id;
    if (!isValidObjectId(productIdParams)) {
      return res.status(400).send({
        status: false,
        message: `<productId> in Params: <${productIdParams}> NOT a Valid Mongoose Object ID.`,
      });
    }

    // Delete Product.
    // const deleteProduct = await inventoryModel.findOneAndDelete({
    const deleteProduct = await inventoryModel.findOneAndUpdate(
      { _id: productIdParams, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    if (!deleteProduct) {
      return res.status(404).send({
        status: false,
        message: `No Such PRODUCT with ID: <${productIdParams}> exist in Database (OR already deleted).`,
      });
    }

    //- **On success** - Return HTTP status 200.
    return res.status(200).send({
      status: true,
      message: "Deleted Product by ID.",
      data: deleteProduct,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
