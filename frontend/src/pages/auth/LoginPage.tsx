// pages/auth/LoginPage.tsx
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom"
import { Navigate, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { fetchTenants, setSelectedTenant } from "../../store/tenantSlice";
import { login, selectAuth, clearError } from "../../store/authSlice";
import { CompanyDropdown } from "../../components/CompanyDropdown";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  company_token: Yup.string().required("Please select a company"),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    tenants,
    selectedTenant,
    loading: tenantsLoading,
    error: tenantsError,
  } = useAppSelector((state) => state.tenant);
  const {
    isAuthenticated,
    loading: authLoading,
    error: authError,
  } = useAppSelector(selectAuth);

  // Fetch tenants only once when component mounts
  useEffect(() => {
    dispatch(fetchTenants());
  }, [dispatch]);

  // Clear any previous auth errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      company_token: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedTenant) return;

      try {
        await dispatch(
          login({
            credentials: {
              email: values.email,
              password: values.password,
              company_token: values.company_token,
            },
            domain: selectedTenant.domains[0]?.domain,
          })
        ).unwrap();

        // Navigate to dashboard on successful login
        navigate("/dashboard", { replace: true });
      } catch (error) {
        // Error is already handled by Redux state
        console.error("Login failed:", error);
      }
    },
  });

  const handleCompanySelect = (company: NonNullable<typeof selectedTenant>) => {
    dispatch(setSelectedTenant(company));
    formik.setFieldValue("company_token", company.id);
  };

  // If already authenticated, redirect immediately
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Login to your account
        </h1>

        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded mb-4">
            {authError}
          </div>
        )}

        {tenantsError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded mb-4">
            {tenantsError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-sm text-red-500 mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-sm text-red-500 mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company
            </label>
            <CompanyDropdown
              companies={tenants}
              selectedCompany={selectedTenant}
              onSelect={handleCompanySelect}
              isLoading={tenantsLoading}
              error={tenantsError}
            />
            {formik.touched.company_token && formik.errors.company_token && (
              <div className="text-sm text-red-500 mt-1">
                {formik.errors.company_token}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={
              !selectedTenant ||
              tenantsLoading ||
              authLoading ||
              !formik.isValid
            }
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            

            {authLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </p>
            <p className="mt-2 text-center text-sm text-gray-600">
  Want to register a company?{" "}
  <Link to="/register-company" className="text-blue-600 hover:underline">
    Register here
  </Link>
</p>
        </form>
      </div>
    </div>
  );
}
