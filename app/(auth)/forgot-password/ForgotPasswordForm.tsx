// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { sendResetPasswordEmailAction } from "@/lib/actions/auth.actions";
// import { showSuccessToast, showErrorToast } from "@/lib/utils/showToastMessage";
// import { forgotPasswordSchema } from "@/lib/validations/usersValidations";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useFormStatus } from "react-dom";
// import { useForm } from "react-hook-form";

// function ForgotPasswordForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(forgotPasswordSchema) });
//   const { pending } = useFormStatus();
//   const onSubmit = async (data: { email: string }) => {
//     const result = await sendResetPasswordEmailAction(data.email);
//     if (result.success) {
//       showSuccessToast("ایمیل بازیابی ارسال شد ✅", "bottom-right");
//     } else if (result.error.type === "custom") {
//       showErrorToast(result.error.message, "bottom-right");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <div>
//         <Label htmlFor="email">ایمیل</Label>
//         <Input
//           id="email"
//           type="email"
//           placeholder="ایمیل خود را وارد کنید"
//           {...register("email")}
//           className="mt-2 rounded-full"
//         />
//         {errors.email && (
//           <p className="text-destructive mt-1 text-sm">
//             {errors.email.message}
//           </p>
//         )}
//       </div>
//       <Button type="submit" className="w-full rounded-full" disabled={pending}>
//         {pending ? "در حال ارسال..." : "ارسال لینک بازیابی"}
//       </Button>
//     </form>
//   );
// }

// export default ForgotPasswordForm;
