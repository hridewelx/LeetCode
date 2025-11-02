import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthenticatedUser } from "./authenticationSlicer"
import { useEffect } from "react";
import ProblemSet from "./pages/ProblemSet";
import AdminPanel from "./pages/AdminPanel";
import SolveProblem from "./pages/SolveProblem";

// In your main router configuration
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./components/Admin/Dashboard";
import Questions from "./components/Admin/Questions";

// Add these routes

function App(){

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.authentication);

  useEffect(() => {
    dispatch(checkAuthenticatedUser());
  }, [dispatch]);

  return(
  <>
    <Routes>
      <Route path="/" element={ isAuthenticated ? <Homepage></Homepage> : <Navigate to="/login"></Navigate> }></Route>
      {/* <Route path="/login" element={ isAuthenticated ? <Navigate to="/"></Navigate> : <Login></Login> }></Route> */}
      <Route path="/login" element={ <Login></Login> }></Route>
      {/* <Route path="/signup" element={ isAuthenticated ? <Navigate to="/"></Navigate> : <Signup></Signup> }></Route> */}
      <Route path="/signup" element={ <Signup></Signup> }></Route>
      <Route path="/problemset" element={ <ProblemSet></ProblemSet> }></Route>
      <Route path="/adminpanel" element={ <AdminPanel></AdminPanel> }></Route>
      <Route path="/problem/:problemId" element={ <SolveProblem></SolveProblem> }></Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="questions" element={<Questions />} />
      </Route>
      <Route path="/admin/questions" element={<Questions />} /> 


      {/* <Route path="/Test" element={ <Test/> }></Route> */}

      {/* {console.log(" isAuthenticated", isAuthenticated)} */}
    </Routes>
  </>
  )
}

export default App;