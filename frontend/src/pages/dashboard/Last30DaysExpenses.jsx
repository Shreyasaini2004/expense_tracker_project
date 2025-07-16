import React, { useMemo } from 'react';
import { prepareExpenseDataForChart } from '../../utils/helper';
import CustomBarChart from '../../components/Charts/CustomBarChart';

const Last30DaysExpenses = ({ data }) => {
  const chartData = useMemo(() => {
    return prepareExpenseDataForChart(data || []);
  }, [data]);

  return (
    <div className='card col-span-1'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Last 30 Days Expenses</h5>
      </div>
      <CustomBarChart data={chartData} />
    </div>
  );
};

export default Last30DaysExpenses;
