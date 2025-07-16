import React from 'react';
import CustomPieChart from '../../components/Charts/CustomPieChart';
const COLORS = ["#875CF5","#FA2C37","#FF6900"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
    const balanceData=[
{name:"Total Balance",amount: totalBalance},
{name:"Total Income",amount: totalIncome},
{name:"Total Expense",amount: totalExpense},
    ];
  return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg">Finance Overview</h5>
            </div>
            <CustomPieChart
                data={balanceData}
                label="Total Balance"
                colors={COLORS}
                totalAmount={`$${totalBalance}`}
                showTextAnchor
                />
        </div>
  )
}

export default FinanceOverview
