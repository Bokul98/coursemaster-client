import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

const Login = () => {
    const [serverError, setServerError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setServerError("");
        setSuccessMsg("");

        try {
            const response = await fetch("http://localhost:5000/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // important for refreshToken cookies
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setServerError(result.error || "Invalid email or password");
                return;
            }

            // SUCCESS — Store access token
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("userRole", result.role || 'student');
            localStorage.setItem("userName", result.name || '');

            // notify app about auth change
            window.dispatchEvent(new Event('authChange'));

            setSuccessMsg("Login successful!");
            console.log("User logged in:", result);

            // redirect to role-appropriate dashboard
            const role = result.role || localStorage.getItem('userRole') || 'student';
            if (role === 'admin') navigate('/admin');
            else navigate('/student');

        } catch (error) {
            setServerError("Something went wrong. Please try again." + (error.message ? ` Error: ${error.message}` : ""));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

            {/* Server Errors */}
            {serverError && (
                <p className="text-red-500 text-sm">{serverError}</p>
            )}
            {successMsg && (
                <p className="text-green-600 text-sm">{successMsg}</p>
            )}

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
