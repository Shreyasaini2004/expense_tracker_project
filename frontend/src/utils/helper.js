import moment from 'moment';

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  let initials = ""; // ✅ use `let` instead of `const`

  for (let i = 0; i < Math.min(2, words.length); i++) {
    if (words[i]) {
      initials += words[i][0];
    }
  }

  return initials.toUpperCase();
};

export const addThousandSeparator=(num)=>{
  if(num==null ||isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fractionalPart
  ? `${formattedInteger}.${fractionalPart}` 
  : formattedInteger;
};



export const prepareExpenseDataForChart = (data = []) => {
  return data.map((item) => ({
    month: moment(item.date).format("MMM DD"), // 🟡 "Jul 01"
    amount: item?.amount,
    category: item?.category,
  }));
};

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData=sortedData.map((item) => ({
month:moment(item?.date).format('Do MMM'),
amount:item?.amount ||0,
category:item?.source||'Unknown',
  }));
  return chartData;
};

// utils/helper.js

export const prepareExpenseLineChartData = (transactions = []) => {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return sorted.map((txn) => ({
    date: new Date(txn.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    }),
    amount: txn.amount,
    category: txn.category || 'Other',
  }));
};

