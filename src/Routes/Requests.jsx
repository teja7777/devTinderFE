import { BASE_URL } from '../utils/constants'
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { requestsList } from '../utils/Redux/requestsSlice';
import { useSelector } from 'react-redux';
import RequestsCarousel from '../components/RequestsCarousel';

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector((store) => store.requests);

    const getRequests = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/user/requests`, { withCredentials: true });

            // Handle both { data: [...] } and direct [...] responses
            const requestsData = Array.isArray(res?.data)
                ? res.data
                : res?.data?.data || [];

            dispatch(requestsList(requestsData));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getRequests();
    }, []);

    return (
        <div className='flex justify-center py-4 h-full'>
            <RequestsCarousel requests={requests} />
        </div>
    );
};

export default Requests