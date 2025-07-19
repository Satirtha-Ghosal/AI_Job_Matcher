import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom"; // or 'next/router' if using Next.js
import FullScreenLoader from "../../utils/fullScreenLoader";

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userid: form.username,
                    pass: form.password
                })
            });

            const data = await res.json();

            if (res.ok) {
                const { accessToken } = data;
                localStorage.setItem("token", accessToken);
                toast.success("Account created successfully!");
                toast.info("Please FilL Your Details !!!")
                navigate("../../profile/editProfile");
            } else {
                toast.error(data.message || "Signup failed. Try again.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center">
            <FullScreenLoader show={loading} />
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">Create Your Account</h2>
                <form onSubmit={handleSignup} className="space-y-5">
                    
                    <div>
                        <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">Username</label>
                        <input
                            name="username"
                            id="username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter Username"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter Password"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block mb-1 text-gray-700 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Enter Password Again"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        Already have an account?{" "}
                        <Link to="../login" className="text-blue-600 font-medium hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
