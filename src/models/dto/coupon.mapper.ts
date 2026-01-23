// src/models/dto/coupon.mapper.ts

import { mapBaseFields } from "./base.mapper";
import { CouponDTO } from "./coupon.dto";

function buildCouponDTO(coupon: any): CouponDTO {
  return {
    ...mapBaseFields(coupon),

    id: coupon._id.toString(),
    code: coupon.code,

    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    maxDiscount: coupon.maxDiscount ?? null,

    validFrom: coupon.validFrom ?? null,
    validTo: coupon.validTo ?? null,

    isActive: coupon.isActive,
  };
}

export const mapCouponDTO = buildCouponDTO;
