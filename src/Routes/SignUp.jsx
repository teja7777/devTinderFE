import axios from "axios";
import { useState } from "react";
import { addUser } from "../utils/Redux/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const SignUp = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "",
        age: "",
        photoUrl: "",
        about: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSignUp = async () => {
        try {
            setError("");
            setIsLoading(true);
            const payload = {
                ...credentials,
                age: credentials.age !== "" && !isNaN(Number(credentials.age)) ? Number(credentials.age) : undefined,
            };
            await axios.post(`${BASE_URL}/signup`, payload, { withCredentials: true });
            navigate("/login");
        } catch (error) {
            console.log({ error });
            const data = error?.response?.data;
            let errMsg = "Failed to sign up";

            if (typeof data === "string") {
                errMsg = data;
            } else if (data?.message && typeof data.message === "string") {
                errMsg = data.message;
            } else if (data?.code === 11000) {
                // MongoDB Duplicate Key Error (e.g. Email already registered)
                const field = Object.keys(data?.keyValue || {})[0] || "Email";
                errMsg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists! Please use a different one or login.`;
            } else if (error?.message) {
                errMsg = error.message;
            }

            setError(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-8 min-h-full">
            <div className="card bg-base-200 w-full max-w-md shadow-xl border border-base-300">
                <div className="card-body p-6 sm:p-8">
                    <h2 className="card-title text-2xl font-bold justify-center mb-2">Create Account</h2>

                    <div className="flex flex-col gap-3">
                        {/* First & Last Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <fieldset className="fieldset">
                                <label className="label" htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={credentials.firstName}
                                    className="input w-full"
                                    placeholder="Enter first name"
                                    onChange={handleChange}
                                />
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label" htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={credentials.lastName}
                                    className="input w-full"
                                    placeholder="Enter last name"
                                    onChange={handleChange}
                                />
                            </fieldset>
                        </div>

                        {/* Email */}
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="email">Email ID</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={credentials.email}
                                className="input w-full"
                                placeholder="Enter email"
                                onChange={handleChange}
                            />
                        </fieldset>

                        {/* Password */}
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={credentials.password}
                                className="input w-full"
                                placeholder="Enter password"
                                onChange={handleChange}
                            />
                        </fieldset>

                        {/* Age & Gender */}
                        <div className="grid grid-cols-2 gap-3">
                            <fieldset className="fieldset">
                                <label className="label" htmlFor="age">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={credentials.age}
                                    className="input w-full"
                                    placeholder="Age"
                                    onChange={handleChange}
                                />
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label" htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={credentials.gender}
                                    className="select w-full"
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>
                            </fieldset>
                        </div>

                        {/* Photo URL */}
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="photoUrl">Photo URL</label>
                            <input
                                type="text"
                                id="photoUrl"
                                name="photoUrl"
                                value={credentials.photoUrl}
                                className="input w-full"
                                placeholder="https://..."
                                onChange={handleChange}
                            />
                        </fieldset>

                        {/* About */}
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="about">About</label>
                            <textarea
                                id="about"
                                name="about"
                                value={credentials.about}
                                className="textarea w-full"
                                placeholder="Tell us about yourself"
                                rows={2}
                                onChange={handleChange}
                            />
                        </fieldset>

                        {error && <p className="text-red-500 text-sm text-center font-medium mt-1">{error}</p>}

                        {/* Sign Up Button */}
                        <div className="card-actions pt-2">
                            <button
                                className="btn btn-primary w-full shadow-md font-semibold"
                                onClick={handleSignUp}
                                disabled={isLoading}
                            >
                                {isLoading && <span className="loading loading-spinner loading-xs"></span>}
                                Sign Up
                            </button>
                        </div>

                        <p className="text-center text-xs text-base-content/70 mt-2">
                            Already have an account?{" "}
                            <Link to="/login" className="link link-primary font-semibold">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
