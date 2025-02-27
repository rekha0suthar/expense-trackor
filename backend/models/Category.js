import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
});

// Mapping id to json responses
categorySchema.method('toJSON', function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
