import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/Redux/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogIn = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/login`, credentials, { withCredentials: true });
            // console.log(res)
            dispatch(addUser(res.data.data));
            navigate("/feed");
        } catch (error) {
            console.log({ error });
            const data = error?.response?.data;
            let errMsg = "Login failed";
            if (typeof data === "string") {
                errMsg = data;
            } else if (data?.message && typeof data.message === "string") {
                errMsg = data.message;
            } else if (error?.message) {
                errMsg = error.message;
            }
            setError(errMsg);
        }
    }

    return (
        <div className="flex justify-center items-center h-full">
            <div className="card bg-base-200 w-96 shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">Login</h2>
                    <div className="flex flex-col gap-4">
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="email">Email ID</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={credentials.email}
                                className="input"
                                placeholder="Enter email"
                                onChange={handleChange}
                            />
                        </fieldset>
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="password">Password</label>
                            <input
                                type="text"
                                id="password"
                                name="password"
                                value={credentials.password}
                                className="input"
                                placeholder="Enter password"
                                onChange={handleChange}
                            />
                        </fieldset>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <div className="card-actions pe-2.5 pt-2">
                            <button className="btn btn-active bg-white py-1 w-full" onClick={handleLogIn}>Login</button>
                        </div>
                        <p className="text-center text-xs text-base-content/70 mt-1">
                            New to DevTinder?{" "}
                            <Link to="/sign-up" className="link link-primary font-semibold">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login