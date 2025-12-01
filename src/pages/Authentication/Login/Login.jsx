import React from "react";
import { useForm } from "react-hook-form";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Login Data:", data);
        // later: call API
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

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
                    {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-[#0E3159] text-white py-2 rounded hover:bg-[#0A2340] transition"
            >
                Login
            </button>

            {/* Redirect */}
            <p className="text-center text-sm mt-2">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-600 hover:underline">
                    Register
                </a>
            </p>
        </form>
    );
};

export default Login;
