"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import Switcher from "@/components/shared/Switcher";

import { formUrlQuery } from "@/lib/utils";

import type { FilterProps } from "@/types";

const Filters = ({ filters }: { filters: FilterProps[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [active, setActive] = useState("");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className={`mt-10 flex flex-wrap-reverse gap-3 md:flex-wrap`}>
      {filters.map((filter, index) => (
        <Button
          key={filter.value}
          onClick={() => handleTypeClick(filter.value)}
          className={`body-medium mb-0.5 mr-0.5 line-clamp-1 rounded-lg px-6 py-3 capitalize shadow-none md:mb-0 md:mr-0 ${
            active === filter.value
              ? "bg-blue-100 text-blue-500 dark:bg-dark-400 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          } `}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default Filters;
