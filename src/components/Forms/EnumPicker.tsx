import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "../ui/form";

interface EnumPickerProps<T extends Record<string, string | number>> {
  enumType: T;
  onChange: (value: T[keyof T]) => void;
  defaultValue?: string;
}

export function EnumPicker<T extends Record<string, string | number>>({
  enumType: enumObject,
  defaultValue,
  onChange,
}: EnumPickerProps<T>) {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(val) => onChange(val as T[keyof T])}
    >
      <FormControl>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectGroup>
          {Object.values(enumObject)
            .filter((val) => typeof val == "string")
            .map((val) => (
              <SelectItem key={val} value={val}>
                {val}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
