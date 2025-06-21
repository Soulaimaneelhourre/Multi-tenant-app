"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useAuth } from "../../contexts/AuthContext"
import { companyService } from "../../services/companyService"
import { CompanyDropdown } from "../../components/CompanyDropdown"
import type { Company } from "../../types/auth"

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
  company_token: Yup.string().when([], {
    is: () => !window.location.hostname.includes("."),
    then: (schema) => schema.required("Please select a company"),
    otherwise: (schema) => schema.notRequired(),
  }),
})

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, error } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [companiesLoading, setCompaniesLoading] = useState(false)
  const [companiesError, setCompaniesError] = useState<string | null>(null)

  // Get tenant slug from subdomain
  const getTenantSlug = () => {
    const hostname = window.location.hostname
    const parts = hostname.split(".")
    if (parts.length > 2 || (parts.length === 2 && parts[1] === "localhost")) {
      return parts[0]
    }
    return ""
  }

  const tenantSlug = getTenantSlug()

  // Fetch companies on component mount (only if not on subdomain)
  useEffect(() => {
    if (!tenantSlug) {
      fetchCompanies()
    } else {
      // If on subdomain, fetch the specific company
      fetchCompanyBySlug(tenantSlug)
    }
  }, [tenantSlug])

  const fetchCompanies = async () => {
    try {
      setCompaniesLoading(true)
      setCompaniesError(null)
      const companiesData = await companyService.getCompanies()
      setCompanies(companiesData)
    } catch (error: any) {
      setCompaniesError(error.response?.data?.message || "Failed to load companies")
    } finally {
      setCompaniesLoading(false)
    }
  }

  const fetchCompanyBySlug = async (slug: string) => {
    try {
      setCompaniesLoading(true)
      setCompaniesError(null)
      const company = await companyService.getCompanyBySlug(slug)
      setSelectedCompany(company)
      formik.setFieldValue("company_token", company.token)
    } catch (error: any) {
      setCompaniesError(error.response?.data?.message || "Company not found")
    } finally {
      setCompaniesLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      company_token: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true)
        await login(values)
        navigate("/dashboard")
      } catch (error) {
        // Error handled in context
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company)
    formik.setFieldValue("company_token", company.token)
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">
            {tenantSlug ? `Sign in to ${selectedCompany?.name || tenantSlug}` : "Sign in to your account"}
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative mt-1">
              <svg
                className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...formik.getFieldProps("email")}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <svg
                className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...formik.getFieldProps("password")}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.password}</p>
            )}
          </div>

          {!tenantSlug && (
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <div className="relative mt-1">
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10"
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
                <CompanyDropdown
                  companies={companies}
                  selectedCompany={selectedCompany}
                  onSelect={handleCompanySelect}
                  isLoading={companiesLoading}
                  error={companiesError}
                />
              </div>
              {formik.touched.company_token && formik.errors.company_token && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.company_token}</p>
              )}
            </div>
          )}

          {tenantSlug && selectedCompany && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center">
                <svg className="h-4 w-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">{selectedCompany.name}</p>
                  <p className="text-xs text-blue-700">{selectedCompany.slug}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isLoading || companiesLoading || (!tenantSlug && !selectedCompany)}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>

        {!tenantSlug && companies.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Or visit your company directly at{" "}
              <span className="font-mono bg-gray-100 px-1 rounded">company-slug.localhost:3000</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
