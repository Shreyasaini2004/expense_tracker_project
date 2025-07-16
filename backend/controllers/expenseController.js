// controllers/expenseController.js
const Expense = require('../models/Expense');
const xlsx = require('xlsx');
const Tesseract = require('tesseract.js');
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'));
    }
});

// Helper to parse OCR text
const parseOcrText = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const parsedData = {
        merchant: null,
        total: null,
        items: [],
        extractedDate: null
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Merchant: assume in first 3 lines
        if (i < 3 && !parsedData.merchant && line.length > 2) {
            parsedData.merchant = line;
        }

        // Total amount
        const totalMatch = line.match(/total[^0-9]*?(\d{1,5}\.?\d{0,2})/i);
        if (totalMatch) {
            parsedData.total = parseFloat(totalMatch[1]);
        }

        // Dates
        let dateMatch = line.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
        if (dateMatch) {
            const [, day, month, year] = dateMatch;
            parsedData.extractedDate = new Date(`${year}-${month}-${day}`);
        } else {
            const altHyphenMonthMatch = line.match(/(\d{1,2})\s*-\s*([A-Za-z]+)\s*-\s*(\d{4})/);
            if (altHyphenMonthMatch) {
                const [, day, monthStr, year] = altHyphenMonthMatch;
                const parsedDate = new Date(`${day} ${monthStr} ${year}`);
                if (!isNaN(parsedDate)) {
                    parsedData.extractedDate = parsedDate;
                }
            } else {
                const altDateMatch = line.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
                if (altDateMatch) {
                    const [, day, monthStr, year] = altDateMatch;
                    const parsedDate = new Date(`${day} ${monthStr} ${year}`);
                    if (!isNaN(parsedDate)) {
                        parsedData.extractedDate = parsedDate;
                    }
                }
            }
        }

        // Items with prices
        const itemMatch = line.match(/^(.+?)\s+\$?(\d+\.?\d*)$/);
        if (itemMatch && itemMatch[1].length > 2) {
            parsedData.items.push({
                name: itemMatch[1].trim(),
                price: parseFloat(itemMatch[2])
            });
        }
    }

    return parsedData;
};


exports.uploadMiddleware = upload.single('receiptImage');

exports.processOcrImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No image file uploaded" });

        const imageBuffer = req.file.buffer;
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
        const parsedData = parseOcrText(text);

        if (parsedData.extractedDate) console.log("Extracted Date:", parsedData.extractedDate);

        const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

        res.json({
            success: true,
            extractedText: text,
            parsedData,
            imageData: base64Image
        });
    } catch (error) {
        console.error('OCR error:', error);
        res.status(500).json({ message: 'Failed to process OCR image', error: error.message });
    }
};

exports.addExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const {
            icon, category, amount, date,
            receiptImage, ocrExtractedText, ocrParsedData, isOcrProcessed
        } = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Category, amount, and date are required." });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
            receiptImage: receiptImage || null,
            ocrExtractedText: ocrExtractedText || null,
            ocrParsedData: ocrParsedData || null,
            isOcrProcessed: isOcrProcessed || false
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        const data = expense.map(item => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
            Merchant: item.ocrParsedData?.merchant || 'N/A',
            'OCR Processed': item.isOcrProcessed ? 'Yes' : 'No',
            'Extracted Text': item.ocrExtractedText || 'N/A'
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};