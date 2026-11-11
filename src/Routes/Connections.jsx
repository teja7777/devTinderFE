import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { connectionsList } from '../utils/Redux/connectionsSlice';

const Connections = () => {
    const dispatch = useDispatch();
    const connectionsData = useSelector((store) => store.connections);
    const userData = useSelector((store) => store.user);
    const [selectedUser, setSelectedUser] = useState(null);

    const getConnections = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });
            const connections = Array.isArray(res?.data)
                ? res.data
                : res?.data?.data || [];
            dispatch(connectionsList(connections));
        } catch (err) {
            console.error("Error fetching connections:", err);
        }
    };

    useEffect(() => {
        getConnections();
    }, []);

    // Helper to determine the other user in the connection
    const getConnectedUser = (connection) => {
        if (!connection) return null;
        const { fromUserId, toUserId } = connection;
        // If the logged-in user is fromUserId, show toUserId. Otherwise show fromUserId.
        if (fromUserId?._id === userData?._id) {
            return toUserId;
        }
        return fromUserId;
    };

    const handleCardClick = (connectedUser) => {
        setSelectedUser(connectedUser);
        const modal = document.getElementById("connection_detail_modal");
        modal?.showModal();
    };

    if (!connectionsData) {
        return (
            <div className="flex justify-center items-center py-24">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (connectionsData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center h-full">
                <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-base-content mb-1">No Connections Yet</h2>
                <p className="text-sm text-base-content/60 max-w-sm mb-6">
                    You haven't connected with any developers yet. Explore your feed and send interested requests!
                </p>
                <Link to="/feed" className="btn btn-primary px-6 shadow-md">
                    Explore Feed
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-base-300">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-base-content">
                        Connected Developers
                    </h1>
                    <p className="text-sm text-base-content/60 mt-1">
                        Developers you have matched with on DevTinder. Click any card to view their full profile.
                    </p>
                </div>
                <div className="badge badge-lg badge-neutral font-semibold py-3 px-4 shadow-sm">
                    {connectionsData.length} {connectionsData.length === 1 ? "Connection" : "Connections"}
                </div>
            </div>

            {/* Small Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {connectionsData.map((connection) => {
                    const connectedUser = getConnectedUser(connection);
                    if (!connectedUser) return null;

                    const fullName = [connectedUser.firstName, connectedUser.lastName].filter(Boolean).join(" ") || "Developer";

                    return (
                        <div
                            key={connection._id}
                            onClick={() => handleCardClick(connectedUser)}
                            className="card bg-base-100 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-base-300/80 rounded-2xl overflow-hidden cursor-pointer group"
                        >
                            {/* Profile Image */}
                            <figure className="h-52 w-full overflow-hidden bg-base-200 relative">
                                <img
                                    src={connectedUser.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                                    alt={fullName}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                {/* Connected Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className="badge badge-xs bg-emerald-500 text-white font-semibold py-2 px-2.5 border-none shadow-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        Connected
                                    </span>
                                </div>
                            </figure>

                            {/* Card Body */}
                            <div className="card-body p-4 bg-base-100">
                                <h3 className="card-title text-base font-bold text-base-content truncate group-hover:text-primary transition-colors">
                                    {fullName}
                                </h3>

                                <div className="flex items-center gap-2 flex-wrap text-xs text-base-content/70 mt-1">
                                    {connectedUser.age && (
                                        <span className="badge badge-sm bg-base-200 border-base-300 font-medium">
                                            🎂 {connectedUser.age} yrs
                                        </span>
                                    )}
                                    {connectedUser.gender && (
                                        <span className="badge badge-sm badge-outline badge-primary capitalize font-medium">
                                            {connectedUser.gender}
                                        </span>
                                    )}
                                </div>

                                {connectedUser.about && (
                                    <p className="text-xs text-base-content/70 line-clamp-2 mt-2 leading-relaxed">
                                        {connectedUser.about}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detailed Info Modal */}
            <dialog id="connection_detail_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-0 max-w-lg overflow-hidden rounded-3xl bg-base-100 border border-base-300 shadow-2xl">
                    {selectedUser && (
                        <div>
                            {/* Modal Header Photo */}
                            <div className="h-64 w-full relative bg-base-200 overflow-hidden">
                                <img
                                    src={selectedUser.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                                    alt={selectedUser.firstName}
                                    className="w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Close Button */}
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("connection_detail_modal")?.close()}
                                    className="btn btn-sm btn-circle bg-black/40 hover:bg-black/70 text-white border-none absolute right-3 top-3 backdrop-blur-sm shadow-md"
                                >
                                    ✕
                                </button>

                                {/* Name on bottom of photo */}
                                <div className="absolute bottom-4 left-6 right-6 text-white">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md">
                                        {[selectedUser.firstName, selectedUser.lastName].filter(Boolean).join(" ")}
                                    </h2>
                                    {selectedUser.email && (
                                        <p className="text-xs text-white/80 flex items-center gap-1.5 mt-1">
                                            ✉️ {selectedUser.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Modal Content Details */}
                            <div className="p-6 space-y-4">
                                {/* Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {selectedUser.age && (
                                        <span className="badge badge-md bg-base-200 border-base-300 font-semibold text-xs py-3 px-3">
                                            🎂 {selectedUser.age} years old
                                        </span>
                                    )}
                                    {selectedUser.gender && (
                                        <span className="badge badge-md badge-outline badge-primary font-semibold text-xs py-3 px-3 capitalize">
                                            {selectedUser.gender.toLowerCase() === "male"
                                                ? "♂ Male"
                                                : selectedUser.gender.toLowerCase() === "female"
                                                    ? "♀ Female"
                                                    : `⚧ ${selectedUser.gender}`}
                                        </span>
                                    )}
                                    <span className="badge badge-md bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold text-xs py-3 px-3">
                                        ✓ Connected Partner
                                    </span>
                                </div>

                                {/* About Bio */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1.5">
                                        About
                                    </h4>
                                    <div className="bg-base-200/60 p-4 rounded-2xl border border-base-300/60 text-sm text-base-content/80 leading-relaxed max-h-40 overflow-y-auto">
                                        {selectedUser.about ? (
                                            <p className="whitespace-pre-line">{selectedUser.about}</p>
                                        ) : (
                                            <p className="italic text-base-content/40 text-xs">
                                                No bio provided by this user.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div className="modal-action pt-2 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById("connection_detail_modal")?.close()}
                                        className="btn btn-ghost"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Backdrop to close when clicking outside */}
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default Connections;
