import mongoose from 'mongoose';

const balanceSchema = new mongoose.Schema({
  currency: { type: String, required: true },
  balanceAmount: { type: Number, required: true },
});

// Mapping id to json responses
balanceSchema.method('toJSON', function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Balance = mongoose.model('Balance', balanceSchema);

export default Balance;
