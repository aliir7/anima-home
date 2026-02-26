import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { formatError } from "@/lib/utils/formatError";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { ActionResult, CartItem } from "@/types";
import { useTransition } from "react";

export function useCartActions() {
  const [isAdding, startAddTransition] = useTransition();
  const [isRemoving, startRemoveTransition] = useTransition();

  const handleActionResponse = <T>(res: ActionResult<T>) => {
    if (res.success) {
      showSuccessToast((res.data || res.message) as string, "top-left");
      return;
    }

    if (res.error.type === "zod") {
      showErrorToast(formatError(res.error), "top-left");
      return;
    }

    if (res.error.type === "custom") {
      // در اینجا res.error.message در دسترس است
      showErrorToast(res.error.message, "top-left");
      return;
    }
  };

  // هندلر افزودن به سبد خرید
  const addToCart = (item: CartItem) => {
    startAddTransition(async () => {
      // فرض بر این است که addItemToCart خروجی از نوع Promise<ActionResult<T>> دارد
      const res = await addItemToCart(item);
      handleActionResponse(res);
    });
  };

  // هندلر حذف از سبد خرید
  const removeFromCart = (
    productId: string,
    variantId: string,
    removeAll: boolean = false,
  ) => {
    startRemoveTransition(async () => {
      // فرض بر این است که removeItemFromCart خروجی از نوع Promise<ActionResult<T>> دارد
      const res = await removeItemFromCart(productId, variantId, removeAll);
      handleActionResponse(res);
    });
  };

  return {
    addToCart,
    removeFromCart,
    isAdding,
    isRemoving,
    isPending: isAdding || isRemoving,
  };
}
