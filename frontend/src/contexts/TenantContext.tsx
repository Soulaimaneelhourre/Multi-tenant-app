"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface TenantContextType {
  tenantSlug: string | null
  setTenantSlug: (slug: string) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantSlug, setTenantSlugState] = useState<string | null>(null)

  useEffect(() => {
    // Extract tenant from subdomain
    const hostname = window.location.hostname
    const parts = hostname.split(".")

    if (parts.length > 2 || (parts.length === 2 && parts[1] === "localhost")) {
      setTenantSlugState(parts[0])
    }
  }, [])

  const setTenantSlug = (slug: string) => {
    setTenantSlugState(slug)
  }

  return <TenantContext.Provider value={{ tenantSlug, setTenantSlug }}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}
