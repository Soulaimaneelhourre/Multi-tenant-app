"use client"

import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useAuth } from "@/contexts/AuthContext"
import { useTenant } from "@/contexts/TenantContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Building2, Mail, Lock } from "lucide-react"

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
  company_slug: Yup.string().when([], {
    is: () => !window.location.hostname.includes("."),
    then: (schema) => schema.required("Company slug is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
})

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const { tenantSlug } = useTenant()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      company_slug: tenantSlug || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true)
        await login(values)
      } catch (error) {
        // Error handled in context
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  {...formik.getFieldProps("email")}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  {...formik.getFieldProps("password")}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>

            {!tenantSlug && (
              <div className="space-y-2">
                <Label htmlFor="company_slug">Company Slug</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company_slug"
                    type="text"
                    placeholder="Enter company slug"
                    className="pl-10"
                    {...formik.getFieldProps("company_slug")}
                  />
                </div>
                {formik.touched.company_slug && formik.errors.company_slug && (
                  <p className="text-sm text-red-600">{formik.errors.company_slug}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
