import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { DEFAULT_INCOME_ICONS } from '../../utils/categoryIcons'; // ✅ Import default income icons

const RecentIncome = ({ transactions, onSeeMore }) => {
  // ✅ Determine the correct icon (custom or default)
  const getIcon = (item) => {
    const rawIcon = typeof item.icon === 'object' ? item.icon?.emoji : item.icon;
    const fallback = DEFAULT_INCOME_ICONS[item.source?.toLowerCase()] || '💰';
    return rawIcon || fallback;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5)?.map((income) => (
          <TransactionInfoCard
            key={income._id}
            title={income.source || 'Income'}
            icon={getIcon(income)}
            date={moment(income.date).format('MMM DD, YYYY')}
            amount={income.amount}
            type="income"
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentIncome;
