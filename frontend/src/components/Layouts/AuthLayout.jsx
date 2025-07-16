import React from "react";
import { LuTrendingUp } from "react-icons/lu";
import img1 from "../../assets/images/img1.png"; // make sure this exists

const AuthLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen flex overflow-hidden">
      {/* LEFT SIDE */}
      <div className="w-full md:w-[60vw] flex flex-col justify-center px-12 py-12 bg-white">
        <h1 className="text-lg font-semibold text-black mb-4 text-center">EXPENSE TRACKER</h1>
        <h2 className="text-lg font-semibold text-black mb-4 text-center">"Your Money. Under Control."

</h2>
        {children}
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-[40vw] h-full bg-[#F4F1FE] relative items-center justify-center overflow-hidden">
        {/* Shapes */}
        <div className="w-32 h-32 rounded-[40px] bg-blue-500 absolute -top-6 -left-6 z-10" />
        <div className="w-40 h-52 rounded-[40px] border-[16px] border-violet-600 absolute top-[25%] -right-10 z-10" />
        <div className="w-32 h-32 rounded-[40px] bg-blue-500 absolute -bottom-6 -left-6 z-10" />

        {/* Card */}
        <div className="absolute top-10 left-8 z-10">
          <StatsInfoCard
            icon={<LuTrendingUp />}
            label="Track Your Income & Expenses"
            value="430,000"
            color="bg-violet-600"
          />
        </div>

        {/* Image */}
        <img
          src={img1}
          alt="Login Visual"
          className="absolute bottom-13 right-12 z-10 max-w-[85%] max-h-[90%] object-contain"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-4 bg-white p-4 rounded-xl shadow-md border z-10">
      <div
        className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full shadow-lg`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-sm text-gray-600 mb-1">{label}</h6>
        <span className="text-[20px]">${value}</span>
      </div>
    </div>
  );
};
