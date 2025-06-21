import { apiClient } from "./apiClient"
import type { Company } from "../types/auth"

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    const response = await apiClient.get("/companies")
    return response.data
  },

  async getCompanyBySlug(slug: string): Promise<Company> {
    const response = await apiClient.get(`/companies/${slug}`)
    return response.data
  },
}
