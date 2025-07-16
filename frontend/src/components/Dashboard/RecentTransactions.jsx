import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { DEFAULT_EXPENSE_ICONS, DEFAULT_INCOME_ICONS } from '../../utils/categoryIcons';

const RecentTransactions = ({ transactions, onSeeMore }) => {
  console.log("RecentTransactions component received:", transactions ?? "No data");

  const getIcon = (item) => {
    const rawIcon = typeof item.icon === 'object' ? item.icon?.emoji : item.icon;
    const fallback =
      item.type === 'expense'
        ? DEFAULT_EXPENSE_ICONS[item.category?.toLowerCase()] || '💼'
        : DEFAULT_INCOME_ICONS[item.source?.toLowerCase()] || '💰';

    return rawIcon || fallback;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between"> 
        <h5 className='text-lg'>Recent Transactions</h5>  
        <button className='card-btn' onClick={onSeeMore}>
          See All <LuArrowRight className='text-base' />
        </button>
      </div>

      <ul className="mt-6">
        {transactions?.length > 0 ? (
          transactions?.slice(0, 5)?.map((item) => (
            <TransactionInfoCard 
              key={item._id}
              title={item.type === 'expense' ? item.category : item.source}
              icon={getIcon(item)}
              date={moment(item.date).format("MMM DD, YYYY")}
              amount={item.amount}
              type={item.type}
              hideDeleteBtn
            />
          ))
        ) : (
          <li className="text-gray-500">No recent transactions</li>
        )}
      </ul>
    </div>
  );
};

export default RecentTransactions;
