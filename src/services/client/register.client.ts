// src/services/client/register.client.ts
import { toast } from "sonner";
import { RegisterFormData, UserUI } from "@/dto/register.ui.dto";
import { ApiResponseUI } from "@/dto/apiResponse.ui.dto";

/**
 * Service to handle user registration
 */
export const registerUser = async (formData: RegisterFormData): Promise<boolean> => {
    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        // Strictly using ApiResponseUI with the UI-specific User DTO
        const json: ApiResponseUI<UserUI> = await response.json();

        if (!json.success) {
            const errorMessage = json.error || "Registration failed.";
            toast.error("Error", { description: errorMessage });
            return false;
        }

        toast.success("Success!", { description: "Your account has been created." });
        return true;

    } catch (error) {
        console.error("Registration Service Error:", error);
        toast.error("Network Error", { 
            description: "Could not connect to the server." 
        });
        return false;
    }
};