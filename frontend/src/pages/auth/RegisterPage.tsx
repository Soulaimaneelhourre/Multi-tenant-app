"use client"

import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Building2, Mail, Lock, User } from "lucide-react"

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
  company_name: Yup.string().required("Company name is required"),
  company_slug: Yup.string()
    .matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .required("Company slug is required"),
})

export function RegisterPage() {
  const { register, isAuthenticated, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      company_name: "",
      company_slug: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true)
        await register(values)
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
          <CardTitle className="text-2xl font-bold text-center">Create account</CardTitle>
          <CardDescription className="text-center">Set up your company workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10"
                  {...formik.getFieldProps("name")}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-600">{formik.errors.name}</p>
              )}
            </div>

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
                  placeholder="Create a password"
                  className="pl-10"
                  {...formik.getFieldProps("password")}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10"
                  {...formik.getFieldProps("password_confirmation")}
                />
              </div>
              {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                <p className="text-sm text-red-600">{formik.errors.password_confirmation}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company_name"
                  type="text"
                  placeholder="Enter company name"
                  className="pl-10"
                  {...formik.getFieldProps("company_name")}
                />
              </div>
              {formik.touched.company_name && formik.errors.company_name && (
                <p className="text-sm text-red-600">{formik.errors.company_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_slug">Company Slug</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company_slug"
                  type="text"
                  placeholder="company-slug"
                  className="pl-10"
                  {...formik.getFieldProps("company_slug")}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This will be your subdomain: {formik.values.company_slug || "company-slug"}.localhost
              </p>
              {formik.touched.company_slug && formik.errors.company_slug && (
                <p className="text-sm text-red-600">{formik.errors.company_slug}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
