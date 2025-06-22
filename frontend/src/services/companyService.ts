import { apiClient } from "./apiClient"
import type { Tenant } from "../types/auth"

export const companyService = {
  async getCompanies(): Promise<Tenant[]> {
    const response = await apiClient.get("/tenants")
    return response.data
  },

  async getCompanyBySlug(slug: string): Promise<Tenant> {
    const response = await apiClient.get(`/companies/${slug}`)
    return response.data
  },
}
