import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom"
import FullScreenLoader from "../../utils/fullScreenLoader";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Replace with your actual login API call
            const res = await fetch("http://localhost:3000/api/auth/signIn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userid: form.username,
                    pass: form.password
                })
            });
            console.log(form)
            const data = await res.json();

            if (res.ok) {
                const { accessToken } = data;
                localStorage.setItem("token", accessToken);
                toast.success("Login successful!");
                navigate("../../profile"); // or redirect as needed
            } else {
                toast.error(data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center">
            <FullScreenLoader show={loading} />
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">Welcome Back</h2>
                <form onSubmit={handleLogin} className="space-y-5">
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
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Log In
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        Don't have an account? <Link to={'../signup'} className="text-blue-600 font-medium hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
