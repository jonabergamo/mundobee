"use client";
import { LineChart, ValueFormatter } from "@tremor/react";
import { DateTime } from "luxon";
import { Label } from "../ui/label";

const dateFormatter = (dateString: string) => {
  return DateTime.fromISO(dateString).toUTC().toFormat("dd LLL HH:mm");
};

export function AreaChartHero({
  data,
  categories,
  index,
  valueFormatter,
  title,
}: {
  title?: string;
  data: any[];
  categories: string[];
  index: string;
  valueFormatter?: ValueFormatter;
}) {
  // Format the data to include readable dates
  const formattedData = data?.map((item: any) => ({
    ...item,
    [index]: dateFormatter(item[index]),
  }));

  return (
    <div className="flex w-full flex-col">
      <Label className="text-xl font-light text-gray-400">{title}</Label>
      <LineChart
        className="h-72"
        data={formattedData}
        index={index}
        categories={categories}
        colors={["yellow-500", "blue-500", "orange-500"]}
        valueFormatter={valueFormatter}
        connectNulls={true}
        showAnimation
        curveType="natural"
        noDataText="Sem dados"
        tickGap={5}
      />
    </div>
  );
}
