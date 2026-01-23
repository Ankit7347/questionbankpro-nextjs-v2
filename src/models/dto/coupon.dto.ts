// src/models/dto/coupon.dto.ts

import { BaseDTO } from "./base.dto";

export interface CouponDTO extends BaseDTO {
  id: string;
  code: string;

  discountType: "PERCENT" | "FLAT";
  discountValue: number;
  maxDiscount?: number;

  validFrom: Date | null;
  validTo: Date | null;

  isActive: boolean;
}
