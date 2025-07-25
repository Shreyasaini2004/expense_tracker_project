import React ,{use, useState,useEffect }from 'react';
import DashboardLayout from '../../components/Layouts/Dashboard';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_URL } from '../../utils/apiPath';
import InfoCard from '../../components/Cards/InfoCard';
import { LuHandCoins,LuWalletMinimal } from 'react-icons/lu';
import {IoMdCard} from "react-icons/io";
import { addThousandSeparator } from '../../utils/helper';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from './Last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
  if (loading) return;
  setLoading(true);

  try {
    const response = await axiosInstance.get(`${API_URL.DASHBOARD.GET_DATA}`);
    console.log("Dashboard data response:", response.data); 
    // ✅ move here

    if (response.data) {
      setDashboardData(response.data);
      console.log("🧾 Dashboard Data:", response.data);

    }
  } catch (error) {
    console.log("Error fetching dashboard data:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchDashboardData(); // ✅ call it normally
}, []);


  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto text-black'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <InfoCard
          icon={<IoMdCard />}
          label="Total Balance"
          value={addThousandSeparator(dashboardData?.totalBalance || 0)}
          color="bg-violet-600"
      />
      <InfoCard
          icon={<LuWalletMinimal/>}
          label="Total Income"
          value={addThousandSeparator(dashboardData?.totalIncome || 0)}
          color="bg-orange-500"
      />
      <InfoCard
          icon={<LuHandCoins/>}
          label="Total Expense"
          value={addThousandSeparator(dashboardData?.totalExpense || 0)}
          color="bg-red-500"
      />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
      <RecentTransactions
      transactions={dashboardData?.recentTransactions}
      onSeeMore={()=>navigate("/expense")}
      />

      <FinanceOverview
      totalBalance={dashboardData?.totalBalance || 0}
      totalIncome={dashboardData?.totalIncome || 0}
      totalExpense={dashboardData?.totalExpense || 0}
    />

    <ExpenseTransactions
  transactions={dashboardData?.last30DaysExpense?.transactions || []}
  onSeeMore={() => navigate("/expense")}
/>

<Last30DaysExpenses
  data={dashboardData?.last30DaysExpense?.transactions || []}
  onSeeMore={() => navigate("/expense")}
/>




<RecentIncome
  transactions={dashboardData?.last60DaysIncome?.transactions || []}
  onSeeMore={() => navigate("/income")}
/>
<RecentIncomeWithChart
data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4)||[]}
totalIncome={dashboardData?.totalIncome || 0}
/>

    </div>
    </div>
  </DashboardLayout>
);
};

export default Home;
