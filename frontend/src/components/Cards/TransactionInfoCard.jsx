import React from 'react';
import {
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
  LuWallet,
  LuBuilding2,
  LuPartyPopper,
  LuBadgePlus,
  LuCircle,
  LuUtensils,
  LuPlane,
  LuShoppingCart,
  LuBus,
  LuDroplet,
  LuBolt,
  LuBook,
  LuCar,
} from 'react-icons/lu'; // All icons used

// Fallback based on source/title
const getIconByCategory = (title) => {
  const lowerTitle = title?.toLowerCase() || '';

  // Income
  if (lowerTitle.includes('salary')) return <LuWallet className="w-8 h-8 text-violet-500" />;
  if (lowerTitle.includes('increment')) return <LuBadgePlus className="w-8 h-8 text-green-500" />;
  if (lowerTitle.includes('bonus')) return <LuPartyPopper className="w-8 h-8 text-pink-400" />;

  // Expense
  if (lowerTitle.includes('rent')) return <LuBuilding2 className="w-8 h-8 text-red-400" />;
  if (lowerTitle.includes('food') || lowerTitle.includes('restaurant')) return <LuUtensils className="w-8 h-8 text-orange-400" />;
  if (lowerTitle.includes('travel') || lowerTitle.includes('flight')) return <LuPlane className="w-8 h-8 text-blue-500" />;
  if (lowerTitle.includes('grocery') || lowerTitle.includes('shopping')) return <LuShoppingCart className="w-8 h-8 text-lime-500" />;
  if (lowerTitle.includes('bus') || lowerTitle.includes('transport')) return <LuBus className="w-8 h-8 text-yellow-500" />;
  if (lowerTitle.includes('water')) return <LuDroplet className="w-8 h-8 text-cyan-400" />;
  if (lowerTitle.includes('electricity') || lowerTitle.includes('power')) return <LuBolt className="w-8 h-8 text-yellow-400" />;
  if (lowerTitle.includes('home') || lowerTitle.includes('mortgage')) return <LuBuilding2 className="w-8 h-8 text-indigo-500" />;
  if (lowerTitle.includes('education') || lowerTitle.includes('book') || lowerTitle.includes('school')) return <LuBook className="w-8 h-8 text-purple-500" />;
  if (lowerTitle.includes('car') || lowerTitle.includes('fuel')) return <LuCar className="w-8 h-8 text-rose-500" />;

  return <LuCircle className="w-8 h-8 text-gray-400" />; // default
};

// Check if the icon string is an image URL
const isImageUrl = (value) => {
  return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
};

const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, onDelete }) => {
  const getAmountStyles = () => {
    return type === 'expense' ? 'text-red-500' : 'text-green-500';
  };

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
          {isImageUrl(icon) ? (
            <img
              src={icon}
              alt={title}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-2xl">
              {icon || getIconByCategory(title)}
            </span>
          )}
        </div>

        {/* Text Content */}
        <div className="ml-3">
          <h6 className="font-medium">{title}</h6>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>

      {/* Amount + Actions */}
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${getAmountStyles()}`}>
          {type === 'expense' ? '-' : '+'}${amount}
        </span>
        {type === 'income' ? (
          <LuTrendingUp className="text-green-500" />
        ) : (
          <LuTrendingDown className="text-red-500" />
        )}
        {!hideDeleteBtn && (
          <button
            className="ml-1 text-gray-400 hover:text-gray-600"
            onClick={onDelete}
            aria-label="Delete transaction"
          >
            <LuTrash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionInfoCard; 