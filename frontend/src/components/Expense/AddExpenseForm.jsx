import React, { useState } from 'react';
import EmojiPickerPopup from '../EmojiPickerPopup';
import { toast } from 'react-toastify';
import { LuCamera, LuX, LuLoader } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_URL } from '../../utils/apiPath';

const AddExpenseForm = ({ onAddExpense, onClose }) => {
  const [expense, setExpense] = useState({
    category: '',
    amount: '',
    date: '',
    icon: '',
  });

  const [ocrData, setOcrData] = useState({
    receiptImage: null,
    extractedText: '',
    parsedData: null,
    isProcessing: false
  });

  const [showOcrSection, setShowOcrSection] = useState(false);
  const [dateError, setDateError] = useState('');

  // Enhanced date validation function
  const validateDate = (dateString) => {
    if (!dateString) return { isValid: false, error: 'Date is required' };
    
    // Check if date is in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return { isValid: false, error: 'Date must be in YYYY-MM-DD format' };
    }
    
    // Check if it's a valid date
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, error: 'Invalid date' };
    }
    
    // Check if the date is not in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    
    {/*if (dateObj > today) {
      return { isValid: false, error: 'Date cannot be in the future' };
    }*/}
    
    // Check if date is not too far in the past (optional - adjust as needed)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 5);
    
    if (dateObj < oneYearAgo) {
      return { isValid: false, error: 'Date cannot be more than 5 years ago' };
    }
    
    return { isValid: true, error: '' };
  };

  // Enhanced date parsing function for OCR
  const parseOcrDate = (dateString) => {
    if (!dateString) return null;
    
    console.log('Attempting to parse date:', dateString);
    
    // Remove extra spaces, currency symbols, and clean up the string
    const cleanedDate = dateString.trim().replace(/\s+/g, ' ').replace(/\$\d+/g, '');
    
    const monthMap = {
      'jan': '01', 'january': '01',
      'feb': '02', 'february': '02',
      'mar': '03', 'march': '03',
      'apr': '04', 'april': '04',
      'may': '05',
      'jun': '06', 'june': '06',
      'jul': '07', 'july': '07',
      'aug': '08', 'august': '08',
      'sep': '09', 'september': '09',
      'oct': '10', 'october': '10',
      'nov': '11', 'november': '11',
      'dec': '12', 'december': '12'
    };
    
    // Try different date formats that might appear in receipts
    const dateFormats = [
      // Standard formats
      {
        regex: /(\d{4})-(\d{2})-(\d{2})/,
        handler: (match) => ({ year: match[1], month: match[2], day: match[3] })
      },
      {
        regex: /(\d{2})\/(\d{2})\/(\d{4})/,
        handler: (match) => ({ month: match[1].padStart(2, '0'), day: match[2].padStart(2, '0'), year: match[3] })
      },
      {
        regex: /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/,
        handler: (match) => ({ month: match[1].padStart(2, '0'), day: match[2].padStart(2, '0'), year: match[3].length === 2 ? '20' + match[3] : match[3] })
      },
      
      // Text-based formats
      {
        regex: /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i,
        handler: (match) => ({ day: match[1].padStart(2, '0'), month: monthMap[match[2].toLowerCase()], year: match[3] })
      },
      {
        regex: /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
        handler: (match) => ({ day: match[1].padStart(2, '0'), month: monthMap[match[2].toLowerCase()], year: match[3] })
      },
      
      // Receipt-specific formats - handling malformed dates like "23 - Jan - - $2025"
      {
        regex: /(\d{1,2})\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*-\s*-?\s*\$?(\d{4})/i,
        handler: (match) => ({ day: match[1].padStart(2, '0'), month: monthMap[match[2].toLowerCase()], year: match[3] })
      },
      {
        regex: /(\d{1,2})\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*-\s*(\d{4})/i,
        handler: (match) => ({ day: match[1].padStart(2, '0'), month: monthMap[match[2].toLowerCase()], year: match[3] })
      },
      
      // Dot separated
      {
        regex: /(\d{1,2})\s*\.\s*(\d{1,2})\s*\.\s*(\d{2,4})/,
        handler: (match) => ({ day: match[1].padStart(2, '0'), month: match[2].padStart(2, '0'), year: match[3].length === 2 ? '20' + match[3] : match[3] })
      }
    ];
    
    for (const format of dateFormats) {
      const match = cleanedDate.match(format.regex);
      if (match) {
        try {
          console.log('Matched format:', format.regex, 'with result:', match);
          
          const { year, month, day } = format.handler(match);
          
          if (!year || !month || !day) {
            console.warn('Incomplete date components:', { year, month, day });
            continue;
          }
          
          const formattedDate = `${year}-${month}-${day}`;
          console.log('Formatted date:', formattedDate);
          
          const validation = validateDate(formattedDate);
          
          if (validation.isValid) {
            console.log('Valid date found:', formattedDate);
            return formattedDate;
          } else {
            console.warn('Date validation failed:', validation.error);
          }
        } catch (error) {
          console.warn('Date parsing error:', error);
        }
      }
    }
    
    console.warn('No valid date format found for:', dateString);
    return null;
  };

  // Get today's date in YYYY-MM-DD format for max attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleChange = (key, value) => {
    setExpense({ ...expense, [key]: value });
    
    // Validate date when it changes
    if (key === 'date') {
      const validation = validateDate(value);
      setDateError(validation.error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setOcrData(prev => ({ ...prev, isProcessing: true }));

    try {
      const formData = new FormData();
      formData.append('receiptImage', file);

      const response = await axiosInstance.post(API_URL.EXPENSE.PROCESS_OCR, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { extractedText, parsedData, imageData } = response.data;

      setOcrData({
        receiptImage: imageData,
        extractedText,
        parsedData,
        isProcessing: false
      });

      if (parsedData) {
        // Enhanced amount parsing
        if (parsedData.total) {
          const amount = parseFloat(parsedData.total.toString().replace(/[^\d.]/g, ''));
          if (!isNaN(amount)) {
            setExpense(prev => ({ ...prev, amount: amount.toString() }));
          }
        }
        
        // Enhanced merchant parsing
        if (parsedData.merchant) {
          setExpense(prev => ({ ...prev, category: parsedData.merchant.trim() }));
        }
        
        // Enhanced date parsing
        if (parsedData.extractedDate) {
          console.log('📅 Raw extracted date:', parsedData.extractedDate);
          const parsedDate = parseOcrDate(parsedData.extractedDate);
          if (parsedDate) {
            console.log('📅 Setting date to:', parsedDate);
            setExpense(prev => ({ ...prev, date: parsedDate }));
            setDateError('');
          } else {
            console.warn('Could not parse date:', parsedData.extractedDate);
            toast.warning('Could not parse date from receipt. Please enter manually.');
          }
        }
      }

      toast.success('Receipt processed successfully!');
    } catch (error) {
      console.error('OCR failed:', error);
      toast.error('Failed to process receipt image');
      setOcrData(prev => ({ ...prev, isProcessing: false }));
    }
  };
// Add this helper function to force current year if date seems to be in future
const adjustDateYear = (dateString) => {
  const currentYear = new Date().getFullYear();
  const parsed = parseOcrDate(dateString);
  
  if (parsed) {
    const dateObj = new Date(parsed);
    if (dateObj.getFullYear() > currentYear) {
      // Replace with current year
      return parsed.replace(/^\d{4}/, currentYear.toString());
    }
  }
  
  return parsed;
};
  const removeImage = () => {
    setOcrData({
      receiptImage: null,
      extractedText: '',
      parsedData: null,
      isProcessing: false
    });
  };

  const handleSubmit = () => {
    // Enhanced validation
    if (!expense.category.trim()) {
      toast.error('Expense category is required');
      return;
    }
    
    if (!expense.amount || isNaN(expense.amount) || Number(expense.amount) <= 0) {
      toast.error('Enter a valid amount greater than 0');
      return;
    }
    
    const dateValidation = validateDate(expense.date);
    if (!dateValidation.isValid) {
      toast.error(dateValidation.error);
      setDateError(dateValidation.error);
      return;
    }

    const expenseWithOcr = {
      ...expense,
      amount: Number(expense.amount), // Ensure amount is a number
      receiptImage: ocrData.receiptImage,
      ocrExtractedText: ocrData.extractedText,
      ocrParsedData: ocrData.parsedData,
      isOcrProcessed: !!ocrData.extractedText
    };

    onAddExpense(expenseWithOcr);
    toast.success('Expense added successfully');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-lg relative overflow-y-auto p-6">
        {/* Close Icon */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          <LuX size={24} />
        </button>

        <div className="space-y-6 mt-2">
          {/* Icon Picker */}
          <div className="flex flex-col items-center border border-dashed border-gray-300 rounded-xl py-6">
            <div className="text-3xl">{expense.icon || '💸'}</div>
            <p className="text-gray-600 mt-1">Icon</p>
            <div className="mt-2">
              <EmojiPickerPopup
                icon={expense.icon}
                onSelect={(icon) => handleChange('icon', icon)}
              />
            </div>
          </div>

          {/* OCR Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-700">Receipt Scanner (Optional)</h4>
              <p className="text-sm text-gray-500">Upload a receipt to auto-fill details</p>
            </div>
            <button
              onClick={() => setShowOcrSection(!showOcrSection)}
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              {showOcrSection ? 'Hide' : 'Show'} Scanner
            </button>
          </div>

          {showOcrSection && (
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              {!ocrData.receiptImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <LuCamera className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Upload a receipt image to extract expense details</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={ocrData.isProcessing}
                    />
                    <span className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 cursor-pointer">
                      {ocrData.isProcessing ? (
                        <>
                          <LuLoader className="inline animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <LuCamera className="inline mr-2" />
                          Choose Image
                        </>
                      )}
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img 
                      src={ocrData.receiptImage} 
                      alt="Receipt" 
                      className="max-w-full max-h-48 object-contain border rounded-lg"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <LuX size={16} />
                    </button>
                  </div>

                  {ocrData.extractedText && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Extracted Text:</h5>
                      <div className="bg-gray-100 p-3 rounded-lg max-h-32 overflow-y-auto">
                        <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                          {ocrData.extractedText}
                        </pre>
                      </div>
                    </div>
                  )}

                  {ocrData.parsedData && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Detected Information:</h5>
                      <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                        {ocrData.parsedData.merchant && (
                          <p><strong>Merchant:</strong> {ocrData.parsedData.merchant}</p>
                        )}
                        {ocrData.parsedData.total && (
                          <p><strong>Total:</strong> ${ocrData.parsedData.total}</p>
                        )}
                        {ocrData.parsedData.extractedDate && (
                          <p><strong>Date:</strong> {ocrData.parsedData.extractedDate}</p>
                        )}
                        {ocrData.parsedData.items && ocrData.parsedData.items.length > 0 && (
                          <div>
                            <strong>Items:</strong>
                            <ul className="list-disc list-inside ml-4">
                              {ocrData.parsedData.items.map((item, i) => (
                                <li key={i}>{item.name} - ${item.price}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={expense.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="e.g. Food, Rent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                value={expense.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="e.g. 1200"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={expense.date}
                onChange={(e) => handleChange('date', e.target.value)}
                max={getTodayDate()}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  dateError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {dateError && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <span className="mr-1">⚠️</span>
                  {dateError}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
              disabled={!!dateError}
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseForm;