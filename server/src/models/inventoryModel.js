const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, required: true, trim: true },

    price: { type: Number, required: true, trim: true },

    quantity: { type: Number, required: true },

    deletedAt: { type: Date, default: null },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);

/* ------- Postman - JSON-Format: -------
  {
      "title": "",
      "description": "",
      "price": ,
      "quantity": ,
  }
-----------------------------------------*/
