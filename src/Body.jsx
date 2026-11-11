import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { Outlet, useNavigate } from "react-router-dom";
import { BASE_URL } from './utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from './utils/Redux/userSlice';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';


const Body = () => {
    const dispatch = useDispatch();
    const naviagte = useNavigate();
    const userData = useSelector((store) => store.user);
    const fetchUser = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/profile/me`,
                { withCredentials: true }
            );
            dispatch(addUser(res.data));
        } catch (err) {
            if (err.status === 401) {
                naviagte("/login");
            }
        }
    };

    useEffect(() => {
        if (!userData) {
            fetchUser();
        }
    }, []);
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="shrink-0 z-50">
                <Navbar />
            </div>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
            <div className="shrink-0 z-50">
                <Footer />
            </div>
        </div>
    );
}

export default Body