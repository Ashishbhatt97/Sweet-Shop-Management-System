import { Routes, Route } from "react-router-dom";
import { Login, Signup, NotFound } from "./pages";
import SweetCard from "./components/Homepage";
import ProtectedRoute from "./layout/ProtectedLayout";
import BasicLayout from "./layout/BasicLayout";

function App() {
  return (
    <Routes>
      <Route element={<BasicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<SweetCard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
