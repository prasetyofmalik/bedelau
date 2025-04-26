import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DateRangePicker({ date, onDateChange }: DateRangePickerProps) {
  const [tempDate, setTempDate] = useState<DateRange | undefined>(date);

  const handleConfirm = () => {
    onDateChange(tempDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal w-full md:w-[250px]",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
                <>
                {format(date.from, "dd")}{" "}
                {date.from.getMonth() !== date.to.getMonth() && format(date.from, "MMM")} -{" "}
                {format(date.to, "dd MMM")}
                </>
            ) : (
              format(date.from, "dd MMM")
            )
          ) : (
            <span>Pilih rentang tanggal</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="end">
        <div className="space-y-3 p-3">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={tempDate}
            onSelect={setTempDate}
            numberOfMonths={1}
          />
          <div className="flex justify-end">
            <Button onClick={handleConfirm}>OK</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}