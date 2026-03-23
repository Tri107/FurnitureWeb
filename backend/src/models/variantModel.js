import mongoose from "mongoose";

// const VariantItemSchema = new mongoose.Schema({
//   sku: { type: String, required: true },
//   price: { type: Number, required: true },
//   stock: { type: Number, default: 0 },
//   specs: {
//     dimensions: {
//       length: Number,
//       width: Number,
//       height: Number
//     },
//     weight: Number,
//     material: String,
//     color: String
//   },
//   status: { 
//     type: String, 
//     default: "available", 
//     enum: ["available", "reserved"] 
//   }
// });

// const ProductVariantSchema = new mongoose.Schema({
//   model3d: { type: String, default: null }, 
//   images: [String], 
  
//   variants: [VariantItemSchema] 
// }, { timestamps: true });

// export default mongoose.model("ProductVariant", ProductVariantSchema);
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