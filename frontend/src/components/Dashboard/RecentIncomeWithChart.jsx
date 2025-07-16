import React, { useEffect } from 'react';
import { useState } from 'react';
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ["#875CF5","#FA2C37","#FF6900"];

const RecentIncomeWithChart = ({data,totalIncome}) => {
    const [chartData, setChartData] = useState([]);

    const prepareChartData = () => {
  const dataArr = data.map(item => ({
    name: item.source || item.date, // Or category/source if available
    amount: item.amount
  }));
  setChartData(dataArr);
};

    useEffect(()=>{
        console.log("Raw income data:", data); 
        prepareChartData();
        //console.log("Chart Data for Pie Chart:", chartData);
        
        //return () => {};
    },[data]);
  return (
    <div className='card'>
        <div className='flex items-center justify-center'>
            <h5 className='text-lg'>Last 60 Days Income</h5>
        </div>
      <CustomPieChart
      data={chartData}
      label="Total Income"
      totalAmount={`$${totalIncome}`}
      showTextAnchor
      colors={COLORS}
      />
    </div>
  )
}

export default RecentIncomeWithChart
