const Income=require("../models/Income");
const Expense=require("../models/Expense");
const {isValidObjectId, Types} = require("mongoose");

const getDashboardData=async(req,res)=>{
    try {
        
        const userId = req.user._id;
        // For newer versions of Mongoose, use 'new Types.ObjectId()' instead
        // const userObjectId = new Types.ObjectId(String(userId));
        

        // Fetch total income
        const totalIncome = await Income.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        console.log("Total Income:", {totalIncome,userId: isValidObjectId(userId)});

        // Fetch total expense
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        //get total income in the last 60 days
        const last60DaysIncome = await Income.find({
            userId: userId,
            createdAt: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });
        
        //get total income for last 60 days
        const incomeLast60Days = last60DaysIncome.reduce(
            (sum, transaction) => sum + transaction.amount, 
            0
        );
        //get total expense in the last 30 days
        const last30DaysExpense = await Expense.find({
            userId: userId,
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //get total expense for last 30 days
        const expenseLast30Days = last30DaysExpense.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        //fetch last 5 transactions (income+expense)
        const incomeTransactions = await Income.find({ userId })
            .sort({ date: -1 }).limit(5);

        const expenseTransactions = await Expense.find({ userId })
            .sort({ date: -1 }).limit(5);

        const lastTransactions = [
            ...incomeTransactions.map(transaction => ({
                ...transaction.toObject(),
                type: "income",
            })),
            ...expenseTransactions.map(transaction => ({
                ...transaction.toObject(),
                type: "expense",
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    //final response
    res.json({
        totalBalance:
            (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
        totalIncome: totalIncome[0]?.total || 0,
        totalExpense: totalExpense[0]?.total || 0,
       last30DaysExpense:{
        total: expenseLast30Days,
        transactions: last30DaysExpense
       },
    last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncome
       },
    recentTransactions: lastTransactions,
    });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getDashboardData
};