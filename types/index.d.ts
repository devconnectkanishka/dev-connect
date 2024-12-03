import { BADGE_CRITERIA } from "@/constants";

export interface FilterProps {
  name: string;
  value: string;
}

export interface ThemeOption {
  label: string;
  value: string;
  icon: string;
}

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface Country {
  name: {
    common: string;
  };
}

export interface ParamsProps {
  params: { id: string };
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;

export interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export interface BadgeParams {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}