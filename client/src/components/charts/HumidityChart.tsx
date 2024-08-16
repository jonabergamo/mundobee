import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metric } from "@/types/Metric";
import { useTheme } from "next-themes";
import { DateTime } from "luxon";

type HumidityChartProps = {
  title?: string;
  description?: string;
  data?: Metric[];
  isLoading?: boolean;
  error?: any;
  internalHumidityKey: string;
  externalHumidityKey: string;
  actualZoom?: "day" | "week" | "month";
  id?: string;
  minIdeal?: number;
  maxIdeal?: number;
};

export default function HumidityChart({
  title,
  data,
  isLoading = false,
  error,
  internalHumidityKey,
  externalHumidityKey,
  actualZoom = "month",
  id = "graph",
  description,
  minIdeal,
  maxIdeal,
}: HumidityChartProps) {
  const { theme } = useTheme();
  const [Chart, setChart] = useState<any>();
  const [selectedZoom, setSelectedZoom] = useState<string>(actualZoom);

  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const [chartData, setChartData] = useState<any>({
    series: [
      {
        name: "Humidade Interna",
        data: [],
      },
      {
        name: "Humidade Externa",
        data: [],
      },
    ],
    options: {
      chart: {
        id: id,
        type: "area",
        height: 350,
        zoom: {
          autoScaleYaxis: true,
        },
      },
      xaxis: {
        type: "datetime",
        tickAmount: 9,
        labels: {
          style: {
            colors: theme === "dark" ? "#FFF" : "#000",
          },
          formatter: function (val: number) {
            return DateTime.fromMillis(val).toUTC().toFormat("dd LLL HH:mm");
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: [
        {
          title: {
            text: "Humidade Interna %",
            style: {
              color: theme === "dark" ? "#FFF" : "#000",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 500,
            },
          },
          labels: {
            style: {
              colors: theme === "dark" ? "#FFF" : "#000",
            },
            formatter: function (val: any) {
              return `${val} %`;
            },
          },
          min: 0,
          max: 100,
          tickAmount: 10,
        },
        {
          min: 0,
          max: 100,
          tickAmount: 10,
          opposite: true,
          title: {
            text: "Humidade Externa (%)",
            style: {
              color: theme === "dark" ? "#FFF" : "#000",
            },
          },
          labels: {
            style: {
              colors: theme === "dark" ? "#FFF" : "#000",
            },
            formatter: function (val: any) {
              return `${val} %`;
            },
          },
        },
      ],
      stroke: {
        curve: "smooth",
        width: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100],
        },
      },
      colors: ["#ffcc00", "#00ccff"],
      legend: {
        show: true,
        labels: {
          colors: theme === "dark" ? "#FFF" : "#000",
        },
      },
      grid: {
        borderColor:
          theme === "dark"
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(0, 0, 0, 0.15)",
      },
      tooltip: {
        theme: theme,
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
        x: {
          show: true,
          format: "dd MMM",
          formatter: undefined,
        },
        y: {
          formatter: function (
            val: any,
            { series, seriesIndex, dataPointIndex, w }: any,
          ) {
            if (seriesIndex === 0) {
              return `${val} %`;
            } else if (seriesIndex === 1) {
              return `${val} %`;
            }
            return val;
          },
        },
      },
      annotations: {
        yaxis: [
          {
            y: maxIdeal,
            y2: 300,
            borderColor: "#000",
            fillColor: "#fe191949",
          },
          {
            y: minIdeal,
            y2: maxIdeal,
            borderColor: "#000",
            fillColor: "#34fe193e",
            label: {
              borderColor: "#34fe193e",
              style: {
                color: theme === "dark" ? "#ffffff" : "#000",
                background: "#34fe193e",
              },
              text: minIdeal && maxIdeal && "Humidade Ideal",
            },
          },
          {
            y: minIdeal,
            y2: -300,
            borderColor: "#000",
            fillColor: "#fe191949",
          },
        ],
      },
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const labels = data.map((item: Metric) =>
        new Date(item.timestamp).toISOString(),
      );
      const internalHumidity = data.map(
        (item: Metric) => item[internalHumidityKey as keyof Metric],
      );
      const externalHumidity = data.map(
        (item: Metric) => item[externalHumidityKey as keyof Metric],
      );

      setChartData((prevChartData: any) => ({
        ...prevChartData,
        series: [
          {
            ...prevChartData.series[0],
            data: internalHumidity,
          },
          {
            ...prevChartData.series[1],
            data: externalHumidity,
          },
        ],
        options: {
          ...prevChartData.options,
          xaxis: {
            ...prevChartData.options.xaxis,
            categories: labels,
            tickAmount: getTickAmount(selectedZoom),
          },
        },
      }));
    }
  }, [data, internalHumidityKey, externalHumidityKey, selectedZoom]);

  const getTickAmount = (zoom: string) => {
    switch (zoom) {
      case "day":
        return 9;
      case "week":
        return 7;
      case "month":
        return 30;
      default:
        return 9;
    }
  };

  useEffect(() => {
    setChartData((prevChartData: any) => ({
      ...prevChartData,
      options: {
        ...prevChartData.options,
        xaxis: {
          ...prevChartData.options.xaxis,
          labels: {
            style: {
              colors: theme === "dark" ? "#FFF" : "#000",
            },
          },
        },
        yaxis: prevChartData.options.yaxis.map((axis: any) => ({
          ...axis,
          title: {
            ...axis.title,
            style: {
              color: theme === "dark" ? "#FFF" : "#000",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 500,
            },
          },
          labels: {
            style: {
              colors: theme === "dark" ? "#FFF" : "#000",
            },
            formatter: function (val: any) {
              if (axis.title.text === "Humidade Interna (%)") {
                return `${val} %`;
              } else if (axis.title.text === "Humidade Externa (%)") {
                return `${val} %`;
              }
              return val;
            },
          },
        })),
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100],
            colorStops: [
              {
                offset: 0,
                color: theme === "dark" ? "#000" : "#fff",
                opacity: 0.2,
              },
              {
                offset: 100,
                opacity: 0.0,
              },
            ],
          },
        },
        legend: {
          ...prevChartData.options.legend,
          labels: {
            colors: theme === "dark" ? "#FFF" : "#000",
          },
        },
        grid: {
          borderColor:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.15)",
        },
        tooltip: {
          theme: theme,
          style: {
            fontSize: "12px",
            fontFamily: undefined,
            backgroundColor: "red",
          },
          x: {
            show: true,
            format: "dd MMM",
            formatter: function (val: number) {
              return DateTime.fromMillis(val).toUTC().toFormat("dd LLL HH:mm");
            },
          },
          y: {
            formatter: function (
              val: any,
              { series, seriesIndex, dataPointIndex, w }: any,
            ) {
              if (seriesIndex === 0) {
                return `${val} %`;
              } else if (seriesIndex === 1) {
                return `${val} %`;
              }
              return val;
            },
          },
        },
        annotations: {
          yaxis: [
            {
              y: maxIdeal,
              y2: 300,
              borderColor: "#000",
              fillColor: "#fe191949",
            },
            {
              y: minIdeal,
              y2: maxIdeal,
              borderColor: "#000",
              fillColor: "#34fe193e",
              label: {
                borderColor: "#34fe193e",
                style: {
                  color: theme === "dark" ? "#ffffff" : "#000",
                  background: "#34fe193e",
                },
                text: minIdeal && maxIdeal && "Humidade Ideal",
              },
            },
            {
              y: minIdeal,
              y2: -300,
              borderColor: "#000",
              fillColor: "#fe191949",
            },
          ],
        },
      },
    }));
  }, [theme]);

  useEffect(() => {
    setSelectedZoom(actualZoom);
    const handleZoomChange = async (zoomOption: "day" | "week" | "month") => {
      setSelectedZoom(zoomOption);

      const now = Date.now();
      let start: number;

      switch (zoomOption) {
        case "day":
          start = DateTime.now().minus({ days: 1 }).toMillis();
          break;
        case "week":
          start = DateTime.now().minus({ weeks: 1 }).toMillis();
          break;
        case "month":
          start = DateTime.now().minus({ months: 1 }).toMillis();
          break;
        default:
          start = DateTime.now().minus({ days: 1 }).toMillis();
          break;
      }

      if (typeof window !== "undefined") {
        const ApexCharts = (await import("apexcharts")).default;
        ApexCharts.exec(id, "zoomX", start, now);
      }
    };
    handleZoomChange(actualZoom);
  }, [actualZoom, id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <Card className="flex w-full flex-col border-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {Chart && (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={250}
          />
        )}
      </CardContent>
    </Card>
  );
}
