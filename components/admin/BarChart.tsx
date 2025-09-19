import React from 'react';

interface ChartData {
    labels: string[];
    values: number[];
}

interface BarChartProps {
  data: ChartData;
  data2?: ChartData; // For stacked/grouped charts
}

const BarChart: React.FC<BarChartProps> = ({ data, data2 }) => {
  const maxValue = Math.max(...data.values, ...(data2 ? data2.values : [0]));

  return (
    <div className="flex items-end h-64 space-x-2 p-4">
      {data.labels.map((label, index) => (
        <div key={label} className="flex-1 flex flex-col items-center justify-end h-full relative">
            <div className="flex justify-center h-full w-full items-end gap-1">
                <div 
                    className="w-full bg-red-500 rounded-t-sm hover:bg-red-400 transition-colors"
                    style={{ height: `${(data.values[index] / maxValue) * 100}%` }}
                    title={`Set 1: ${data.values[index]}`}
                ></div>
                {data2 && (
                    <div 
                        className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-400 transition-colors"
                        style={{ height: `${(data2.values[index] / maxValue) * 100}%` }}
                        title={`Set 2: ${data2.values[index]}`}
                    ></div>
                )}
            </div>
          <span className="text-xs text-gray-400 mt-2 absolute -bottom-5">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;