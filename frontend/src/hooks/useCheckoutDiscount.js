import { useState } from "react";
import { getDiscounts } from "@/lib/api";

export default function useCheckoutDiscount(cartTotal) {
  const [discountCode, setDiscountCode] = useState("");
  const [discountId, setDiscountId] = useState(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountMessage, setDiscountMessage] = useState("");

  const handleApplyDiscount = async () => {
    const code = discountCode.trim().toUpperCase();

    if (!code) {
      setDiscountId(null);
      setDiscountValue(0);
      setDiscountMessage("Vui lòng nhập mã giảm giá.");
      return;
    }

    try {
      const res = await getDiscounts();
      const discounts = res?.data || [];

      const found = discounts.find(
        (item) => item.discount_code?.toUpperCase() === code,
      );

      if (!found) {
        setDiscountId(null);
        setDiscountValue(0);
        setDiscountMessage("Mã không tồn tại.");
        return;
      }

      if (Number(found.is_disabled) === 1) {
        setDiscountId(null);
        setDiscountValue(0);
        setDiscountMessage("Mã hiện không khả dụng.");
        return;
      }

      const now = new Date();
      const validFrom = found.valid_from ? new Date(found.valid_from) : null;
      const validTo = found.valid_to ? new Date(found.valid_to) : null;

      if (validFrom && now < validFrom) {
        setDiscountId(null);
        setDiscountValue(0);
        setDiscountMessage("Mã chưa đến thời gian áp dụng.");
        return;
      }

      if (validTo && now > validTo) {
        setDiscountId(null);
        setDiscountValue(0);
        setDiscountMessage("Mã đã hết hạn.");
        return;
      }

      let appliedDiscount = 0;

      if (found.discount_percentage != null) {
        appliedDiscount = Math.round(
          (cartTotal * Number(found.discount_percentage)) / 100,
        );
      } else if (found.discount_amount != null) {
        appliedDiscount = Number(found.discount_amount) || 0;
      }

      setDiscountId(found.discount_id);
      setDiscountValue(appliedDiscount);
      setDiscountMessage(`Áp dụng mã ${found.discount_code} thành công.`);
    } catch (error) {
      setDiscountId(null);
      setDiscountValue(0);
      setDiscountMessage("Không thể kiểm tra mã giảm giá.");
    }
  };

  return {
    discountCode,
    setDiscountCode,
    discountId,
    discountValue,
    discountMessage,
    handleApplyDiscount,
  };
}
