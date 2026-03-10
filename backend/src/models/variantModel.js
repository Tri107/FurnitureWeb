import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  price: Number,
  stock: Number,
  specs: {
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    weight: Number,
    material: String,
    color: String
  },
  url: [String]
});

export default mongoose.model("Variant", VariantSchema);