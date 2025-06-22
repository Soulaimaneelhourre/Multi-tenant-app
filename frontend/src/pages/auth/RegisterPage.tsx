// pages/auth/RegisterPage.tsx
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { fetchTenants, setSelectedTenant } from "../../store/tenantSlice";
import { register, clearError } from "../../store/authSlice";
import { CompanyDropdown } from "../../components/CompanyDropdown";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
  tenant_id: Yup.string().required("Please select a company"),
});

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    tenants,
    selectedTenant,
    loading: tenantsLoading,
    error: tenantsError,
  } = useAppSelector((state) => state.tenant);
  
  const {
    loading: authLoading,
    error: authError,
  } = useAppSelector((state) => state.auth);

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
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      tenant_id: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedTenant) return;

      try {
        await dispatch(
          register({
            userData: {
              name: values.name,
              email: values.email,
              password: values.password,
              password_confirmation: values.password_confirmation,
              tenant_id: values.tenant_id,
            },
            domain: selectedTenant.domains[0]?.domain,
          })
        ).unwrap();

        // Navigate to login page on successful registration
        navigate("/login", { replace: true });
      } catch (error) {
        // Error is already handled by Redux state
        console.error("Registration failed:", error);
      }
    },
  });

  const handleCompanySelect = (company: NonNullable<typeof selectedTenant>) => {
    dispatch(setSelectedTenant(company));
    formik.setFieldValue("tenant_id", company.id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Set up your company workspace</p>
        </div>

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
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              {...formik.getFieldProps("name")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-sm text-red-500 mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

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
            {formik.touched.tenant_id && formik.errors.tenant_id && (
              <div className="text-sm text-red-500 mt-1">
                {formik.errors.tenant_id}
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
              placeholder="Create a password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-sm text-red-500 mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              {...formik.getFieldProps("password_confirmation")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
            />
            {formik.touched.password_confirmation && formik.errors.password_confirmation && (
              <div className="text-sm text-red-500 mt-1">
                {formik.errors.password_confirmation}
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
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}