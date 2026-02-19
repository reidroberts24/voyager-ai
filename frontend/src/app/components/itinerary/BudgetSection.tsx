import { DollarSign } from 'lucide-react';

interface BudgetCategory {
  label: string;
  amount: number;
  color: string;
}

interface BudgetSectionProps {
  totalBudget: number;
  plannedSpending: number;
  categories: BudgetCategory[];
}

export function BudgetSection({ totalBudget, plannedSpending, categories }: BudgetSectionProps) {
  const remaining = totalBudget - plannedSpending;
  const isOverBudget = remaining < 0;

  return (
    <section id="budget" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl mb-8">Budget Breakdown</h2>

        {/* Budget Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Budget</p>
            <p className="text-3xl font-medium text-gray-900">${totalBudget.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Planned Spending</p>
            <p className="text-3xl font-medium text-blue-600">${plannedSpending.toLocaleString()}</p>
          </div>
          <div className={`bg-white rounded-2xl p-6 border ${isOverBudget ? 'border-red-200' : 'border-green-200'}`}>
            <p className="text-sm text-gray-600 mb-1">{isOverBudget ? 'Over Budget' : 'Remaining'}</p>
            <p className={`text-3xl font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.abs(remaining).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Visual Breakdown */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h3 className="text-xl mb-6">Spending by Category</h3>

          {/* Horizontal Stacked Bar */}
          <div className="mb-8">
            <div className="flex h-12 rounded-full overflow-hidden shadow-md">
              {categories.map((category, idx) => {
                const percentage = (category.amount / plannedSpending) * 100;
                return (
                  <div
                    key={idx}
                    className={`${category.color} flex items-center justify-center text-white text-sm font-medium transition-all hover:opacity-80`}
                    style={{ width: `${percentage}%` }}
                    title={`${category.label}: $${category.amount}`}
                  >
                    {percentage > 10 && <span>${category.amount}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itemized List */}
          <div className="space-y-4">
            {categories.map((category, idx) => {
              const percentage = ((category.amount / plannedSpending) * 100).toFixed(1);
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`${category.color} w-4 h-4 rounded-full`} />
                    <span className="text-gray-900">{category.label}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${category.color} h-2 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <p className="font-medium">${category.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart Alternative */}
        <div className="mt-8 bg-white rounded-2xl p-8 border border-gray-200">
          <h3 className="text-xl mb-6">Budget Allocation</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Simple donut representation */}
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {categories.map((category, idx) => {
                  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
                  const percentage = (category.amount / total) * 100;
                  const prevPercentage = categories
                    .slice(0, idx)
                    .reduce((sum, cat) => sum + (cat.amount / total) * 100, 0);
                  
                  return (
                    <circle
                      key={idx}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={category.color.replace('bg-', '')}
                      strokeWidth="20"
                      strokeDasharray={`${percentage * 2.513} ${100 * 2.513}`}
                      strokeDashoffset={-prevPercentage * 2.513}
                      className="transition-all"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-medium">${plannedSpending.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              {categories.map((category, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className={`${category.color} w-3 h-3 rounded-full mt-1 flex-shrink-0`} />
                  <div>
                    <p className="text-sm font-medium">{category.label}</p>
                    <p className="text-sm text-gray-600">${category.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
