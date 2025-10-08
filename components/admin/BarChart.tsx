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
  const maxValue = Math.ceil(Math.max(...data.values, ...(data2 ? data2.values : [0])) * 1.1);

  return (
    <div className="flex items-end h-64 space-x-2 p-4 pt-0">
      {data.labels.map((label, index) => (
        <div key={label} className="flex-1 flex flex-col items-center justify-end h-full relative group">
            <div className="flex justify-center h-full w-full items-end gap-1">
                <div 
                    className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-400 transition-colors relative"
                    style={{ height: `${(data.values[index] / maxValue) * 100}%` }}
                >
                     <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 text-gray-700">{data.values[index]}</span>
                </div>
                {data2 && (
                    <div 
                        className="w-full bg-sky-400 rounded-t-sm hover:bg-sky-300 transition-colors relative"
                        style={{ height: `${(data2.values[index] / maxValue) * 100}%` }}
                    >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 text-gray-700">{data2.values[index]}</span>
                    </div>
                )}
            </div>
          <span className="text-xs text-gray-500 mt-2 absolute -bottom-5">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
