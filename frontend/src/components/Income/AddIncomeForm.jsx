import React, { useState } from 'react';
import EmojiPickerPopup from '../EmojiPickerPopup';

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: '',
    amount: '',
    date: '',
    icon: '',
  });

  const handleChange = (key, value) => {
    setIncome({ ...income, [key]: value });
  };

  const handleSubmit = () => {
    if (!income.source || !income.amount || !income.date) {
      alert('Please fill all fields');
      return;
    }
    onAddIncome(income);
  };

  return (
    <div className="space-y-4">
      {/* Icon Picker */}
      <div className="flex flex-col items-center border border-dashed border-gray-300 rounded-xl py-6">
        <div className="text-3xl">{income.icon || '🌿'}</div>
        <p className="text-gray-600 mt-1">Icon</p>
        <div className="mt-2">
          <EmojiPickerPopup icon={income.icon} onSelect={(icon) => handleChange('icon', icon)} />
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <input
            type="text"
            value={income.source}
            onChange={(e) => handleChange('source', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g. Salary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            value={income.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g. 10000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={income.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition"
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
