import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

const Register = () => {
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

        // Password match check
        if (data.password !== data.confirmPassword) {
            setServerError("Passwords do not match");
            return;
        }

        const payload = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
        };

        try {
            const res = await fetch("https://coursemaster-ruddy.vercel.app/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                setServerError(result.error || "Registration failed");
                return;
            }

            setSuccessMsg("Account created successfully!");
            // auto-login after successful signup
            try {
                const signinRes = await fetch("https://coursemaster-ruddy.vercel.app/auth/signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email: data.email, password: data.password })
                });

                const signinResult = await signinRes.json();
                if (signinRes.ok) {
                    localStorage.setItem('accessToken', signinResult.accessToken);
                    localStorage.setItem('userRole', signinResult.role || 'student');
                    localStorage.setItem('userName', signinResult.name || '');
                    window.dispatchEvent(new Event('authChange'));
                    const role = signinResult.role || localStorage.getItem('userRole') || 'student';
                    if (role === 'admin') navigate('/admin');
                    else navigate('/student');
                } else {
                    // fallback: redirect to login
                    navigate('/login');
                }
            } catch (e) {
                navigate('/login');
            }
        } catch (err) {
            setServerError(err?.message || "Something went wrong. Try again!");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 w-full max-w-md mx-auto"
        >
            <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

            {/* Server Messages */}
            {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
            {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

            {/* Full Name */}
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

            {/* Phone */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Phone Number</label>
                <input
                    type="text"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    {...register("phone", { required: "Phone number is required" })}
                />
                {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
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
                        required: "Please confirm your password",
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
