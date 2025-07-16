import React from 'react';
import { LuDownload } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { DEFAULT_INCOME_ICONS } from '../../utils/categoryIcons';

const IncomeList = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transactions?.map((income) => {
          const fallbackIcon = DEFAULT_INCOME_ICONS[income.source?.toLowerCase()] || '💼';
          const icon = income.icon || fallbackIcon;

          return (
            <TransactionInfoCard
              key={income._id}
              title={income.source}
              amount={income.amount}
              date={moment(income.date).format('DD MMM YYYY')}
              icon={icon}
              type="income"
              onDelete={() => onDelete(income._id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default IncomeList;
