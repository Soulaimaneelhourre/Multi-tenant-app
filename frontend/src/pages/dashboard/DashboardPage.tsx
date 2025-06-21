"use client"

import { useState } from "react"

export default function DashboardPage() {
  const [notes] = useState([
    { id: 1, title: "Welcome Note", content: "Welcome to your notes app!", date: "2024-01-15" },
    { id: 2, title: "Getting Started", content: "Here's how to use the app...", date: "2024-01-14" },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notes Dashboard</h1>
              <p className="text-gray-600">Manage your notes</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">New Note</button>
              <button onClick={() => (window.location.href = "/login")} className="text-gray-600 hover:text-gray-900">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h3>
              <p className="text-gray-600 mb-4">{note.content}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{note.date}</span>
                <div className="space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
