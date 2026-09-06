import {
  insertProjectSchema,
  selectProjectSchema,
  updateProjectSchema,
} from "@/lib/validations/projectsValidations";
import z from "zod";
import { Category } from "./category";

export type InsertProjectValues = z.infer<typeof insertProjectSchema>;
export type UpdateProjectValues = z.infer<typeof updateProjectSchema>;
export type Project = z.infer<typeof selectProjectSchema>;
export type ProjectFormValues = z.infer<typeof insertProjectSchema>;

export type ProjectWithCategory = Project & {
  category?: Category;
};
