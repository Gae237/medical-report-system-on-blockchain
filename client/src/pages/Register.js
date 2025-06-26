"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useWeb3 } from "../context/Web3Context"
import { User, Stethoscope, Shield, FileText } from "lucide-react"
import toast from "react-hot-toast"

const Register = () => {
  const [selectedRole, setSelectedRole] = useState(null)
  const { account, registerUser, loading, isRegistered, userRole } = useWeb3()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (isRegistered) {
      if (userRole === 1) {
        navigate("/patient")
      } else if (userRole === 2) {
        navigate("/doctor")
      }
    }
  }, [isRegistered, userRole, navigate])

  const handleRegister = async () => {
    if (!selectedRole) {
      toast.error("Please select a role")
      return
    }

    try {
      await registerUser(selectedRole)
      // Navigation will be handled by useEffect
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 dark:text-gray-300">Please connect your MetaMask wallet to register</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Register Your Role</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Choose your role to get started with MedChain</p>
        </div>

        <div className="space-y-4">
          {/* Patient Role */}
          <div
            onClick={() => setSelectedRole(1)}
            className={`cursor-pointer p-6 border-2 rounded-lg transition-all ${
              selectedRole === 1
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-full ${
                  selectedRole === 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Patient</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Upload and manage your medical reports</p>
              </div>
              {selectedRole === 1 && (
                <div className="text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Doctor Role */}
          <div
            onClick={() => setSelectedRole(2)}
            className={`cursor-pointer p-6 border-2 rounded-lg transition-all ${
              selectedRole === 2
                ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-full ${
                  selectedRole === 2
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Doctor</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Access patient reports with permission</p>
              </div>
              {selectedRole === 2 && (
                <div className="text-green-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Role Benefits */}
        {selectedRole && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {selectedRole === 1 ? "As a Patient, you can:" : "As a Doctor, you can:"}
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              {selectedRole === 1 ? (
                <>
                  <li className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Upload and store medical reports securely</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Control who can access your reports</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Grant and revoke doctor access anytime</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>View patient reports with permission</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Access secure, verified medical data</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Collaborate with patients seamlessly</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={!selectedRole || loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            selectedRole && !loading
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Registering..." : "Complete Registration"}
        </button>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Connected as: <span className="font-mono">{account}</span>
        </div>
      </div>
    </div>
  )
}

export default Register
