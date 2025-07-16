import React from 'react';
import { LuDownload } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { DEFAULT_EXPENSE_ICONS } from '../../utils/categoryIcons'; // ✅ fix import path

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expense Sources</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transactions?.map((expense) => {
          const rawIcon =
            typeof expense.icon === 'object' ? expense.icon?.emoji : expense.icon;

          const fallbackIcon =
            DEFAULT_EXPENSE_ICONS[expense.category?.toLowerCase()] || '💼';

          const finalIcon = rawIcon || fallbackIcon;

          return (
            <TransactionInfoCard
              key={expense._id}
              title={expense.category}
              amount={expense.amount || 0}
              date={moment(expense.date).format('DD MMM YYYY')}
              icon={finalIcon}
              type="expense"
              onDelete={() => onDelete(expense._id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;
