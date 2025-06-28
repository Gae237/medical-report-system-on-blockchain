"use client"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { useWeb3 } from "../context/Web3Context"
import { useTheme } from "../context/ThemeContext"
import { motion } from "framer-motion"
import { Moon, Sun, Activity, User, Stethoscope, Copy, Check } from "lucide-react"
import toast from "react-hot-toast"

const Navbar = () => {
  const { account, connectWallet, userRole, isRegistered, loading } = useWeb3()
  const { isDark, toggleTheme } = useTheme()
  const [copied, setCopied] = useState(false)
  const location = useLocation()

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      toast.success("Address copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-30"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MedChain
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                location.pathname === "/"
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              Home
            </Link>

            {isRegistered && userRole === 1 && (
              <Link
                to="/patient"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/patient"
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                Patient Dashboard
              </Link>
            )}

            {isRegistered && userRole === 2 && (
              <Link
                to="/doctor"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/doctor"
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                Doctor Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Wallet Connection */}
            {account ? (
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg"
                >
                  {getRoleIcon()}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{getRoleName()}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg group cursor-pointer"
                  onClick={copyAddress}
                >
                  <span className="text-sm font-mono text-blue-800 dark:text-blue-300">
                    {`${account.slice(0, 6)}...${account.slice(-4)}`}
                  </span>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                    )}
                  </motion.div>
                </motion.div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                disabled={loading}
                className="relative px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute inset-0 border-2 border-transparent border-t-white rounded-lg"
                  />
                )}
                <span className={loading ? "opacity-0" : "opacity-100"}>Connect Wallet</span>
                {loading && <span className="absolute inset-0 flex items-center justify-center">Connecting...</span>}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
