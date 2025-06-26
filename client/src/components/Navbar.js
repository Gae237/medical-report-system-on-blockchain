"use client"
import { Link, useLocation } from "react-router-dom"
import { useWeb3 } from "../context/Web3Context"
import { useTheme } from "../context/ThemeContext"
import { Moon, Sun, Activity, User, Stethoscope } from "lucide-react"

const Navbar = () => {
  const { account, connectWallet, userRole, isRegistered } = useWeb3()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  const getRoleIcon = () => {
    if (userRole === 1) return <User className="w-4 h-4" />
    if (userRole === 2) return <Stethoscope className="w-4 h-4" />
    return null
  }

  const getRoleName = () => {
    if (userRole === 1) return "Patient"
    if (userRole === 2) return "Doctor"
    return "Not Registered"
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">MedChain</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/"
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Home
            </Link>

            {isRegistered && userRole === 1 && (
              <Link
                to="/patient"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/patient"
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                Patient Dashboard
              </Link>
            )}

            {isRegistered && userRole === 2 && (
              <Link
                to="/doctor"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/doctor"
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                Doctor Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wallet Connection */}
            {account ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                  {getRoleIcon()}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{getRoleName()}</span>
                </div>
                <div className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                  <span className="text-sm font-mono text-blue-800 dark:text-blue-300">
                    {`${account.slice(0, 6)}...${account.slice(-4)}`}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
