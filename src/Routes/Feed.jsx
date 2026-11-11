import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/Redux/feedSlice';
import UserCard from "../components/UserCard";

const Feed = () => {
    const dispatch = useDispatch();
    const feed = useSelector((store) => store.feed);
    const [currentIndex, setCurrentIndex] = useState(0);

    const getFeed = async () => {
        if (feed) return;
        try {
            const res = await axios.get(`${BASE_URL}/feed`, { withCredentials: true });
            const data = Array.isArray(res?.data) ? res?.data : res?.data?.data || [];
            dispatch(addFeed(data));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getFeed();
    }, []);

    const safeIndex = feed && feed.length > 0 ? Math.min(currentIndex, feed.length - 1) : 0;

    const handlePrev = () => {
        if (!feed || feed.length <= 1) return;
        setCurrentIndex((prev) => (prev <= 0 ? feed.length - 1 : prev - 1));
    };

    const handleNext = () => {
        if (!feed || feed.length <= 1) return;
        setCurrentIndex((prev) => (prev >= feed.length - 1 ? 0 : prev + 1));
    };

    // Keyboard navigation (ArrowUp / ArrowDown)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowUp") handlePrev();
            if (e.key === "ArrowDown") handleNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [feed, safeIndex]);

    if (!feed) {
        return (
            <div className="flex justify-center items-center py-24 h-full">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center py-6 min-h-full">
            <div className="relative w-full max-w-3xl flex justify-center px-2">
                <UserCard
                    user={feed[safeIndex]}
                    cardIndex={safeIndex}
                    totalCards={feed.length}
                />

                {/* Vertical Floating Navigation Arrows */}
                {feed.length > 1 && (
                    <div className="flex flex-col gap-2 absolute -right-3 sm:-right-14 top-1/2 -translate-y-1/2 z-20">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="btn btn-circle btn-sm bg-base-100 hover:bg-base-200 shadow-lg border border-base-300 text-base-content"
                            title="Previous Profile (Arrow Up)"
                        >
                            ▲
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="btn btn-circle btn-sm bg-base-100 hover:bg-base-200 shadow-lg border border-base-300 text-base-content"
                            title="Next Profile (Arrow Down)"
                        >
                            ▼
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
