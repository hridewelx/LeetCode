import {Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthenticatedUser } from "./authenticationSlicer"
import { useEffect } from "react";
import ProblemSet from "./pages/ProblemSet";

function App(){

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.authentication);

  useEffect(() => {
    dispatch(checkAuthenticatedUser());
  }, [dispatch]);

  return(
    // console.log(" isAuthenticated", isAuthenticated),
  <>
    <Routes>
      <Route path="/" element={ isAuthenticated ? <Homepage></Homepage> : <Navigate to="/login"></Navigate> }></Route>
      {/* <Route path="/login" element={ isAuthenticated ? <Navigate to="/"></Navigate> : <Login></Login> }></Route> */}
      <Route path="/login" element={ <Login></Login> }></Route>
      {/* <Route path="/signup" element={ isAuthenticated ? <Navigate to="/"></Navigate> : <Signup></Signup> }></Route> */}
      <Route path="/signup" element={ <Signup></Signup> }></Route>
      <Route path="/problemset" element={ <ProblemSet></ProblemSet> }></Route>
    </Routes>
  </>
  )
}

export default App;