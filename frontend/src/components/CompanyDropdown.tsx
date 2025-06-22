"use client"

import { useState, useEffect, useRef } from "react"
import type { Tenant } from "../types/auth"

interface CompanyDropdownProps {
  companies: Tenant[];
  selectedCompany: Tenant | null;
  onSelect: (company: Tenant) => void;
  isLoading?: boolean
  error?: string | null
}

export function CompanyDropdown({ companies, selectedCompany, onSelect, isLoading, error }: CompanyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="relative">
        <div className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Loading companies...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative">
        <div className="pl-10 block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm bg-red-50 text-red-700">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-left"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <span className={selectedCompany ? "text-gray-900" : "text-gray-500"}>
            {selectedCompany ? selectedCompany.id : "Select a company"}
          </span>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
          role="listbox"
        >
          {companies.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-sm">No companies available</div>
          ) : (
            companies.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => {
                  onSelect(company)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-900 ${
                  selectedCompany?.id === company.id ? "bg-blue-100 text-blue-900" : "text-gray-900"
                }`}
                role="option"
                aria-selected={selectedCompany?.id === company.id}
              >
                <div>
                  <div className="font-medium">{company.id}</div>
                  <div className="text-xs text-gray-500">{company.id}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
