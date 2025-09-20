import { useMeQuery } from "@/services/api";
import { resetTokens } from "@/store/reducers/authReducer";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";

const BasicLayout = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useMeQuery();
  const userRole = user?.data.role;
  const { isAuthenticate } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticate && userRole && !isLoading) {
      console.log("redirecting", userRole, isAuthenticate, isLoading);
      navigate(`/`);
    }
  }, [userRole, isAuthenticate, navigate, isLoading]);

  return (
    <>
      <nav className="fixed top-4 right-0 left-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between rounded-full border border-[#101010] bg-[#101010]/30 px-4 py-2 shadow-[rgba(35,35,40,0.1)] backdrop-blur-md backdrop-saturate-150">
            <div className="h-10 w-32 rounded-full bg-[#353535] flex items-center justify-center text-white font-medium">
              <Link to={"/"}>Sweet shop</Link>
            </div>

            <div className="absolute left-1/2 hidden -translate-x-1/2 transform items-center space-x-8 md:flex"></div>

            <div className="flex items-center gap-3">
              {isAuthenticate ? (
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                    dispatch(resetTokens());
                  }}
                  className="rounded-full bg-[#353535] px-6 py-2 text-sm leading-5 font-medium text-white"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-full bg-[#353535] px-6 py-2 text-sm leading-5 font-medium text-white"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24">
        <Outlet />
      </div>
    </>
  );
};

export default BasicLayout;
