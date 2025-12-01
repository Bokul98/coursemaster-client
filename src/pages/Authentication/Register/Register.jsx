import React from "react";
import { useForm } from "react-hook-form";

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Register Data:", data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 w-full max-w-md mx-auto"
        >
            <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

            {/* Name */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Full Name</label>
                <input
                    type="text"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Password</label>
                <input
                    type="password"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Minimum 6 characters",
                        },
                    })}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Confirm Password</label>
                <input
                    type="password"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    {...register("confirmPassword", {
                        required: "Confirm your password",
                    })}
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-[#0D3056] text-white py-2 rounded hover:bg-[#0A2340] transition"
            >
                Register
            </button>

            {/* Redirect */}
            <p className="text-center text-sm mt-2">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                    Login
                </a>
            </p>
        </form>
    );
};

export default Register;
