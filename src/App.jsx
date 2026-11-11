import { BrowserRouter, Route, Routes } from "react-router-dom";

import Body from "./Body.jsx";
import Feed from "./Routes/Feed";
import Login from "./Routes/Login";
import Profile from "./Routes/Profile";
import Connections from "./Routes/Connections";
import Requests from "./Routes/Requests";
import SignUp from "./Routes/SignUp";
import { Provider } from "react-redux";
import appStore from "./utils/Redux/appStore.js";


function App() {

  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />} >
              <Route path="/feed" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Route>
          </Routes>

        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App;
