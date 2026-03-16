import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  price: Number,
  stock: Number,
  specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  url: [String]
});

export default mongoose.model("Variant", VariantSchema);