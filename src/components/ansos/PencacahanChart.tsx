import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface PencacahanChartProps {
  data: any[];
  surveyType?: string;
}

export function PencacahanChart({ data, surveyType }: PencacahanChartProps) {
  if (surveyType === "seruti25" || surveyType === "supas25") {
    // For Seruti25, only show Seruti data
    const serutiCompletedCount = data.filter(
      (item) => item.status === "sudah"
    ).length;
    const serutiInProgressCount = data.filter(
      (item) => item.status === "belum"
    ).length;
    const serutiNotStartedCount = data.filter(
      (item) => !item.status || item.status === ""
    ).length;
    const serutiTotal =
      serutiCompletedCount + serutiInProgressCount + serutiNotStartedCount;

    const serutiChartData = [
      {
        name: "Sudah Selesai",
        value: serutiCompletedCount,
        percentage: ((serutiCompletedCount / serutiTotal) * 100).toFixed(2),
      },
      {
        name: "Belum Selesai",
        value: serutiInProgressCount,
        percentage: ((serutiInProgressCount / serutiTotal) * 100).toFixed(2),
      },
      {
        name: "Belum Input",
        value: serutiNotStartedCount,
        percentage: ((serutiNotStartedCount / serutiTotal) * 100).toFixed(2),
      },
    ];

    const COLORS = ["#4ade80", "#fbbf24", "#94a3b8"];

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
      <div className="space-y-4 mb-4 md:mb-0">
        <h3 className="text-xl font-semibold text-secondary mb-4 text-center">
          Pencacahan
        </h3>
        <div className="w-[80%] md:w-full aspect-square max-w-md mx-auto">
          {/* <h4 className="text-lg font-semibold text-secondary mx-3 text-center">
            Seruti
          </h4> */}
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={serutiChartData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={0}
                dataKey="value"
                className={`${surveyType}-pencacahan-chart`}
                onMouseEnter={(data, index) => {
                  const paths = document.querySelectorAll(
                    `.${surveyType}-pencacahan-chart .recharts-sector`
                  );
                  paths.forEach((path, i) => {
                    if (i !== index) {
                      (path as SVGPathElement).style.fill = "#e5e7eb";
                    }
                  });
                }}
                onMouseLeave={() => {
                  const paths = document.querySelectorAll(
                    `.${surveyType}-pencacahan-chart .recharts-sector`
                  );
                  paths.forEach((path, i) => {
                    (path as SVGPathElement).style.fill = COLORS[i];
                  });
                }}
              >
                {serutiChartData.map((entry, index) => (
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
                wrapperStyle={{
                  fontSize: window.innerWidth < 768 ? "11px" : "14px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Original logic for other survey types
  // Separate data into Susenas-only and Susenas+Seruti
  const susenasData = data.filter((item) => item.sample_code?.startsWith("1"));
  const serutiData = data.filter((item) => item.sample_code?.startsWith("2"));

  const susenasCompletedCount = susenasData.filter(
    (item) => item.status === "sudah"
  ).length;
  const susenasInProgressCount = susenasData.filter(
    (item) => item.status === "belum"
  ).length;
  const susenasNotStartedCount = susenasData.filter(
    (item) => !item.status
  ).length;
  const susenasTotal =
    susenasCompletedCount + susenasInProgressCount + susenasNotStartedCount;

  const serutiCompletedCount = serutiData.filter(
    (item) => item.status === "sudah"
  ).length;
  const serutiInProgressCount = serutiData.filter(
    (item) => item.status === "belum"
  ).length;
  const serutiNotStartedCount = serutiData.filter(
    (item) => !item.status
  ).length;
  const serutiTotal =
    serutiCompletedCount + serutiInProgressCount + serutiNotStartedCount;

  const createChartData = (
    completed: number,
    inProgress: number,
    notStarted: number,
    total: number
  ) => [
    {
      name: "Sudah Selesai",
      value: completed,
      percentage: ((completed / total) * 100).toFixed(2),
    },
    {
      name: "Belum Selesai",
      value: inProgress,
      percentage: ((inProgress / total) * 100).toFixed(2),
    },
    {
      name: "Belum Input",
      value: notStarted,
      percentage: ((notStarted / total) * 100).toFixed(2),
    },
  ];

  const susenasChartData = createChartData(
    susenasCompletedCount,
    susenasInProgressCount,
    susenasNotStartedCount,
    susenasTotal
  );

  const serutiChartData = createChartData(
    serutiCompletedCount,
    serutiInProgressCount,
    serutiNotStartedCount,
    serutiTotal
  );

  const COLORS = ["#4ade80", "#fbbf24", "#94a3b8"];
  const HOVER_COLOR = "#e5e7eb";

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

  const RenderPieChart = ({
    data,
    className,
    title,
  }: {
    data: any[];
    className: string;
    title: string;
  }) => (
    <div className="w-[80%] md:w-full aspect-square max-w-md mx-auto">
      <h4 className="text-lg font-semibold text-secondary mx-3 text-center">
        {title}
      </h4>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            dataKey="value"
            className={`${surveyType}-${className}`}
            onMouseEnter={(data, index) => {
              const paths = document.querySelectorAll(
                `.${surveyType}-${className} .recharts-sector`
              );
              paths.forEach((path, i) => {
                if (i !== index) {
                  (path as SVGPathElement).style.fill = HOVER_COLOR;
                }
              });
            }}
            onMouseLeave={() => {
              const paths = document.querySelectorAll(
                `.${surveyType}-${className} .recharts-sector`
              );
              paths.forEach((path, i) => {
                (path as SVGPathElement).style.fill = COLORS[i];
              });
            }}
          >
            {data.map((entry, index) => (
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
            wrapperStyle={{
              fontSize: window.innerWidth < 768 ? "11px" : "14px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-4 mb-4 md:mb-0">
      <h3 className="text-xl font-semibold text-secondary mb-4 text-center">
        Progress Pencacahan
      </h3>
      <div className="grid md:grid-cols-2 gap-2">
        <RenderPieChart
          data={susenasChartData}
          className="susenas-chart"
          title="Susenas"
        />
        <RenderPieChart
          data={serutiChartData}
          className="seruti-chart"
          title="Susenas + Seruti"
        />
      </div>
    </div>
  );
}
