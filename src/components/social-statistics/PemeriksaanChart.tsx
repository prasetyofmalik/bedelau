import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PemeriksaanChartProps {
  data: any[];
}

export function PemeriksaanChart({ data }: PemeriksaanChartProps) {
  // Count updates by status
  const completedCount = data.filter(item => item.status === 'sudah').length;
  const pendingCount = data.filter(item => item.status !== 'sudah').length;
  const total = completedCount + pendingCount;

  const chartData = [
    { 
      name: 'Sudah', 
      value: completedCount,
      percentage: ((completedCount / total) * 100).toFixed(2)
    },
    { 
      name: 'Belum', 
      value: pendingCount,
      percentage: ((pendingCount / total) * 100).toFixed(2)
    },
  ];

  const COLORS = ['#ffcc5c', '#fff0ae'];
  const HOVER_COLOR = '#e5e7eb';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].payload.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-[80%] aspect-square max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-secondary mx-3 text-center">Pemeriksaan</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            dataKey="value"
            className="pemeriksaan-chart"
            onMouseEnter={(data, index) => {
              const paths = document.querySelectorAll('.pemeriksaan-chart .recharts-sector');
              paths.forEach((path, i) => {
                if (i !== index) {
                  (path as SVGPathElement).style.fill = HOVER_COLOR;
                }
              });
            }}
            onMouseLeave={() => {
              const paths = document.querySelectorAll('.pemeriksaan-chart .recharts-sector');
              paths.forEach((path, i) => {
                (path as SVGPathElement).style.fill = COLORS[i];
              });
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => {
              const { payload } = entry as any;
              return `${value} ${payload.value}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}