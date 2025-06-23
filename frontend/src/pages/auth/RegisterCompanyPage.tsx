// 📁 src/pages/RegisterCompanyPage.tsx
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

export default function RegisterCompanyPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: {
      company_name: "",
      domain: "",
    },
    validationSchema: Yup.object({
      company_name: Yup.string()
        .required("Company name is required")
        .matches(/^[a-zA-Z0-9_-]+$/, "Only alphanumeric, dashes and underscores allowed"),
      domain: Yup.string()
        .required("Domain is required")
        .matches(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and dashes allowed"),
    }),
    onSubmit: async (values) => {
      setError(null)
      setSuccess(null)
      try {
        await axios.post("http://localhost:8000/register-company", values)
        setSuccess("Company registered successfully!")
        setTimeout(() => navigate("/login"), 1500)
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to register company. Try again."
        )
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Register Your Company
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded text-sm">
            {success}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              {...formik.getFieldProps("company_name")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. company1"
            />
            {formik.touched.company_name && formik.errors.company_name && (
              <div className="text-sm text-red-500 mt-1">
                {formik.errors.company_name}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="domain"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Domain (subdomain only, no .localhost)
            </label>
            <input
              type="text"
              id="domain"
              {...formik.getFieldProps("domain")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. company1"
            />
            {formik.touched.domain && formik.errors.domain && (
              <div className="text-sm text-red-500 mt-1">
                {formik.errors.domain}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? "Registering..." : "Register Company"}
          </button>
        </form>
      </div>
    </div>
  )
}
