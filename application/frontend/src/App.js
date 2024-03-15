import React, { Suspense } from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import "./scss/style.scss";
import useToken from "./components/authentication/useToken";
import Logout from "./components/authentication/Logout";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));
const ChangePasswordRequest = React.lazy(() =>
  import("./views/pages/changepassword/ChangePasswordRequest")
);
const ChangePassword = React.lazy(() =>
  import("./views/pages/changepassword/ChangePassword")
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/login" name="Login Page" element={<Login />} />
          <Route
            path="/changepasswordrequest"
            name="Change password request"
            element={<ChangePasswordRequest />}
          />

          <Route
            path="/changepassword/:reset_token/:email"
            name="Change password"
            element={<ChangePassword />}
          />

          <Route path="/logout" name="Logout Page" element={<Logout />} />
          <Route path="/register" name="Register Page" element={<Register />} />
          <Route path="/404" name="Page 404" element={<Page404 />} />
          <Route path="/500" name="Page 500" element={<Page500 />} />

          <Route
            path="/*"
            name="Dashboard"
            element={
              <RequireAuth redirectTo="/login">
                <div>
                  <DefaultLayout />
                </div>
              </RequireAuth>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function RequireAuth({ children, redirectTo, allowAnonymous }) {
  const { token } = useToken();
  const isLoggedIn = !!token; // Convert token to a boolean value

  // Provide additional information about the user's authentication status and selected course
  const selectedCourse = null; // You need to retrieve the selected course information from your state
  const shouldRender = allowAnonymous ? true : isLoggedIn;

  return shouldRender ? (
    typeof children === "function" ? (
      children(isLoggedIn, selectedCourse)
    ) : (
      children
    )
  ) : (
    <Navigate to={redirectTo} replace={true} />
  );
}

export default App;
