import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layouts/Dashboard';
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_URL } from '../../utils/apiPath';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUserAuth from '../../hooks/useUserAuth';

const Income = () => {
  useUserAuth();
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Fetch all income
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(API_URL.INCOME.GET_ALL_INCOME);
      setIncomeData(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Add new income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    if (!source.trim()) {
      toast.error('Source is required');
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
      await axiosInstance.post(API_URL.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success('Income added');
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        'Error adding income:',
        error.response?.data?.message || error.message
      );
    }
  };

  // Delete income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_URL.INCOME.DELETE_INCOME(id));
      toast.success('Income deleted successfully');
      setOpenDeleteAlert({ show: false, data: null });
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        'Error deleting income:',
        error.response?.data?.message || error.message
      );
    }
  };

  // Placeholder for future download
  const handleDownloadIncomeDetails = async () => {
    try{
      const response = await axiosInstance.get(API_URL.INCOME.DOWNLOAD_INCOME, {
        responseType: 'blob', 
      });

      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_details.xlsx'); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Income details downloaded successfully');
    } catch (error) {
      console.error(
        'Error downloading income details:',
        error.response?.data?.message || error.message
      );
      toast.error('Failed to download income details');
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto text-black'>
        <div className='grid grid-cols-1 gap-6'>
          <IncomeOverview
            transactions={incomeData}
            onAddIncome={() => setOpenAddIncomeModal(true)}
          />

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title='Add Income'
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title='Delete Income'
        >
          <DeleteAlert
            content='Are you sure you want to delete this income source?'
            onDelete={() => {
              deleteIncome(openDeleteAlert.data);
            }}
          />
        </Modal>
      </div>

      {/* ✅ Toast container to show success/error messages */}
      <ToastContainer position='top-right' autoClose={3000} theme='light' />
    </DashboardLayout>
  );
};

export default Income;
