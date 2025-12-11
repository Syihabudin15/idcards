import { User } from "@prisma/client";

export interface IUser extends User {}

export interface IActionTable<T> {
  openUpsert: boolean;
  selected: T | undefined;
  openDelete: boolean;
}

export interface IPageProps<T> {
  page: number;
  limit: number;
  search: string;
  total: number;
  data: T[];
  [key: string]: any;
}
