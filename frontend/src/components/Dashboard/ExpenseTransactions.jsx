import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { DEFAULT_EXPENSE_ICONS } from '../../utils/categoryIcons';

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  const getIcon = (item) => {
    const rawIcon = typeof item.icon === 'object' ? item.icon?.emoji : item.icon;
    return rawIcon || DEFAULT_EXPENSE_ICONS[item.category?.toLowerCase()] || '💼';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5)?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.category}
            icon={getIcon(expense)}
            date={moment(expense.date).format('MMM DD, YYYY')}
            amount={expense.amount}
            type="expense"
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
