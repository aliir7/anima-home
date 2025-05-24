"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  ActionResult,
  SigninValues,
  SignupFormValues,
  SignupInsert,
} from "@/types";
import {
  signinSchema,
  signupFormSchema,
} from "../validations/usersValidations";
import { signIn, signOut } from "../auth";
import { getUserByEmail } from "@/db/queries/getUserByEmail";
import { AuthError } from "next-auth";

// register user action
export async function signupAction(
  formData: SignupFormValues,
): Promise<ActionResult<SignupInsert>> {
  try {
    // validation form data with schema
    const validated = signupFormSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validated.error.issues,
        },
      };
    }

    const { name, email, password } = validated.data;

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "کاربری با این ایمیل از قبل وجود دارد.",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    // automatic signIn after signUp
    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return {
      success: true,
      data: {
        ...user,
        name: user.name ?? "",
        password: user.password ?? "",
        address: user.address ?? undefined,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: {
        type: "custom",
        message:
          err instanceof Error
            ? err.message
            : "خطای ناشناخته‌ای در ثبت‌ نام رخ داد.",
      },
    };
  }
}

export async function signinWithCredentials(
  formData: SigninValues,
): Promise<ActionResult<string>> {
  try {
    const validated = signinSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validated.error.issues,
        },
      };
    }

    const { email, password } = validated.data;

    const user = await getUserByEmail(email);

    if (!user || !user.password) {
      return {
        success: false,
        error: { type: "custom", message: "کاربری با این مشخصات وجود ندارد" },
      };
    }

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return { success: true, data: "با موفقیت وارد شدید" };
  } catch (err) {
    console.log(err);
    if (err instanceof AuthError) {
      return {
        success: false,
        error: { type: "custom", message: "ایمیل یا رمز عبور صحیح نیست" },
      };
    }
    return {
      success: false,
      error: { type: "custom", message: "خطای ناشناخته رخ داده است" },
    };
  }
}

// signOut user action
export async function userSignOut() {
  await signOut();
}
