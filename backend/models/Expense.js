import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  expenseDate: {
    type: Date,
    required: true,
  },
});

// Mapping id to json responses
expenseSchema.method('toJSON', function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
