import React, { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import CustomBarChart from '../Charts/CustomBarChart';
import { prepareIncomeBarChartData } from '../../utils/helper';
import { DEFAULT_INCOME_ICONS } from '../../utils/categoryIcons';

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setChartData(result);
  }, [transactions]);

  const isImageUrl = (value) =>
    typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg font-semibold">Income Overview</h5>
          <p className="text-xs text-gray-500">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>
        <button className="add-btn" onClick={onAddIncome}>
          <LuPlus className="text-lg" />
          Add Income
        </button>
      </div>

      <div className="mt-10">
        <CustomBarChart data={chartData} />
      </div>

      <div className="mt-10 space-y-4">
        {transactions.map((item) => {
          const rawIcon = typeof item.icon === 'object' ? item.icon?.emoji : item.icon;
          const fallbackIcon = DEFAULT_INCOME_ICONS[item.source?.toLowerCase()] || '💼';
          const icon = rawIcon || fallbackIcon;

          return (
            <div key={item._id} className="flex items-center gap-4 border-b pb-4">
              <div className="w-10 h-10 flex items-center justify-center text-2xl bg-gray-100 rounded-full">
                {isImageUrl(icon) ? (
                  <img src={icon} alt="icon" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>{icon}</span>
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-medium text-black">{item.source}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="text-green-600 font-semibold">+${item.amount}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncomeOverview;
