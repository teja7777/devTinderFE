import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeUser } from '../utils/Redux/userSlice';
import { removeFeed } from '../utils/Redux/feedSlice';
import { clearConnectionsList } from '../utils/Redux/connectionsSlice';
import { removeRequestFromList } from '../utils/Redux/requestsSlice';

const Navbar = () => {
    const user = useSelector(store => store.user);
    const [imageError, setImageError] = useState(false);
    const name = user?.name || user?.firstName;
    const initial = name ? name.trim().charAt(0).toUpperCase() : null;
    const photoUrl = user?.photoUrl;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        setImageError(false);
    }, [photoUrl]);

    const handleLogOut = async () => {
        try {
            await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
            dispatch(removeUser());
            dispatch(removeFeed());
            dispatch(clearConnectionsList());
            dispatch(removeRequestFromList());
            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="navbar bg-base-200 shadow-sm">
            <div className="flex-1">
                <Link to="/feed" className="btn btn-ghost text-xl">DevTinder</Link>
            </div>
            <div className="flex gap-2">
                {/* <input type="text" placeholder="Search" className="input w-24 md:w-auto" /> */}
                <div className="dropdown dropdown-end mx-5">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        {photoUrl && !imageError ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-base-content/20 shadow-sm">
                                <img
                                    src={photoUrl}
                                    alt={name || "User Avatar"}
                                    className="w-full h-full object-cover object-top"
                                    onError={() => setImageError(true)}
                                />
                            </div>
                        ) : initial ? (
                            <div className="w-10 h-10 rounded-full bg-base-300 text-base-content font-bold text-lg flex items-center justify-center uppercase select-none border border-base-content/20 shadow-sm">
                                <span>{initial}</span>
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-base-content/70">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>

                    {user ?
                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <Link to="/feed" className="justify-between">
                                    Feed
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="justify-between">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/connections" className="justify-between">
                                    Connections
                                </Link>
                            </li>
                            <li>
                                <Link to="/requests" className="justify-between">
                                    Requests
                                </Link>
                            </li>
                            <li><a onClick={handleLogOut}>Logout</a></li>
                        </ul> : ""
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar