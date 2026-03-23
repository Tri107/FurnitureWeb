// import mongoose from "mongoose";

// const VariantSchema = new mongoose.Schema({
//   price: Number,
//   stock: Number,
//   specs: { type: mongoose.Schema.Types.Mixed, default: {} },
//   url: [String]
// });

// export default mongoose.model("Variant", VariantSchema);

import mongoose from "mongoose";

const DemensionsSchema = new mongoose.Schema({
  length: Number,
  width: Number,
  height: Number
}, { _id: false });
const SpecsSchema = new mongoose.Schema({
  dimensions: DemensionsSchema,
  weight: Number,
  material: String,
  color: String,
}, { _id: false });

const VariantSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  specs: {
    type: SpecsSchema,
    default: {}
  },
  status: {
    type: String,
    enum: ["available", "out_of_stock", "hidden"],
    default: "available"
  }
}, {
  timestamps: true
});

export default mongoose.model("Variant", VariantSchema); 