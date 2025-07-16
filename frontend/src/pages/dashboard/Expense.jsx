
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layouts/Dashboard';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_URL } from '../../utils/apiPath';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUserAuth from '../../hooks/useUserAuth';

const Expense = () => {
  useUserAuth();
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [incomeData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Fetch all expense
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(API_URL.EXPENSE.GET_ALL_EXPENSE);
      setExpenseData(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Add new expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category.trim()) {
      toast.error('Category is required');
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Amount should be a valid number greater than 0');
      return;
    }
    if (!date) {
      toast.error('Date is required');
      return;
    }

    try {
      await axiosInstance.post(API_URL.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        'Error adding expense:',
        error.response?.data?.message || error.message
      );
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_URL.EXPENSE.DELETE_EXPENSE(id));
      toast.success('Expense deleted successfully');
      setOpenDeleteAlert({ show: false, data: null });
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        'Error deleting expense:',
        error.response?.data?.message || error.message
      );
    }
  };

  // Placeholder for future download
  const handleDownloadExpenseDetails = async () => {
    try{
      const response = await axiosInstance.get(API_URL.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob', 
    }
      );

      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx'); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Expense details downloaded successfully');
    } catch (error) {
      console.error(
        'Error downloading expense details:',error);
        toast.error('Failed to download expense details'
      );
    }
    
  };

  useEffect(() => {
    fetchExpenseDetails();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto text-black'>
        <div className='grid grid-cols-1 gap-6'>
          <ExpenseOverview
            transactions={incomeData}
            onAddExpense={() => setOpenAddExpenseModal(true)}
          />

          <ExpenseList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title='Add Expense'
        >
          <AddExpenseForm onAddExpense={handleAddExpense} 
          onClose={() => setOpenAddExpenseModal(false)}/>
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title='Delete Expense'
        >
          <DeleteAlert
            content='Are you sure you want to delete this expense source?'
            onDelete={() => {
              deleteExpense(openDeleteAlert.data);
            }}
          />
        </Modal>
      </div>

      {/* ✅ Toast container to show success/error messages */}
      <ToastContainer position='top-right' autoClose={3000} theme='light' />
    </DashboardLayout>
  );
};

export default Expense;

