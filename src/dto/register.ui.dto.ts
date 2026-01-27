// src/dto/register.ui.dto.ts
export interface RegisterFormData {
    name: string;
    email: string;
    phone: string;
    stateName: string;
    districtName: string;
    className: string;
    courseName?: string;
    password: string;
}

/**
 * Clean User object for UI use only
 */
export interface UserUI {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
}