import { useTransition, useOptimistic } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { formatError } from "@/lib/utils/formatError";
import { showErrorToast } from "@/lib/utils/showToastMessage";
import { ActionResult, CartItem } from "@/types";

type OptimisticAction =
  | { type: "ADD"; payload: CartItem }
  | {
      type: "REMOVE";
      payload: { productId: string; variantId: string; removeAll: boolean };
    };

export function useCartActions(initialItems: CartItem[] = []) {
  const [isPending, startTransition] = useTransition();

  const [optimisticCart, dispatchOptimistic] = useOptimistic<
    CartItem[],
    OptimisticAction
  >(initialItems, (state, action) => {
    switch (action.type) {
      case "ADD": {
        const existingIndex = state.findIndex(
          (i) =>
            i.productId === action.payload.productId &&
            i.variantId === action.payload.variantId,
        );
        if (existingIndex > -1) {
          const newState = [...state];
          newState[existingIndex] = {
            ...newState[existingIndex],
            qty: newState[existingIndex].qty + 1,
          };
          return newState;
        }
        return [...state, { ...action.payload, qty: 1 }];
      }
      case "REMOVE": {
        if (action.payload.removeAll) {
          return state.filter(
            (i) =>
              !(
                i.productId === action.payload.productId &&
                i.variantId === action.payload.variantId
              ),
          );
        }
        return state
          .map((i) => {
            if (
              i.productId === action.payload.productId &&
              i.variantId === action.payload.variantId
            ) {
              return { ...i, qty: Math.max(0, i.qty - 1) };
            }
            return i;
          })
          .filter((i) => i.qty > 0);
      }
      default:
        return state;
    }
  });

  const handleActionResponse = <T>(res: ActionResult<T>) => {
    if (!res.success) {
      if (res.error?.type === "zod") {
        showErrorToast(formatError(res.error), "top-left");
      } else {
        showErrorToast(res.error?.message || "خطایی رخ داد", "top-left");
      }
    }
  };

  const addToCart = (item: CartItem) => {
    // تغییر مهم: dispatch به داخل startTransition منتقل شد
    startTransition(async () => {
      dispatchOptimistic({ type: "ADD", payload: item });

      const res = await addItemToCart(item);
      handleActionResponse(res);
    });
  };

  const removeFromCart = (
    productId: string,
    variantId: string,
    removeAll: boolean = false,
  ) => {
    // تغییر مهم: dispatch به داخل startTransition منتقل شد
    startTransition(async () => {
      dispatchOptimistic({
        type: "REMOVE",
        payload: { productId, variantId, removeAll },
      });

      const res = await removeItemFromCart(productId, variantId, removeAll);
      handleActionResponse(res);
    });
  };

  return {
    optimisticCart,
    addToCart,
    removeFromCart,
  };
}
