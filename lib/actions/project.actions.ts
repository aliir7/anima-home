"use server";

import { ActionResult, InsertProjectValues } from "@/types";
import { insertProjectSchema } from "../validations/projectsValidations";

// action for create project
export async function createProject(
  data: InsertProjectValues,
): Promise<ActionResult<null>> {
  try {
    // validation data
    const validated = insertProjectSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validated.error.issues,
        },
      };
    }

    // if validation passed
    const { title, description, categoryId, images, videos } = validated.data;
  } catch (error) {}
}
