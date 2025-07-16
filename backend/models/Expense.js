// models/Expense.js
const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    icon: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    receiptImage: {
        type: String,
        default: null
    },
    ocrExtractedText: {
        type: String,
        default: null
    },
    ocrParsedData: {
        type: {
            merchant: { type: String, default: null },
            total: { type: Number, default: null },
            items: [{ name: String, price: Number }],
            extractedDate: { type: Date, default: null }
        },
        default: {}
    },
    isOcrProcessed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);