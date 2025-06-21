export interface User {
  id: number
  name: string
  email: string
  company: {
    id: number
    name: string
    slug: string
  }
}

export interface Company {
  id: number
  name: string
  slug: string
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
  company_token?: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
  company_name: string
  company_slug: string
}

export interface AuthResponse {
  user: User
  token: string
}
