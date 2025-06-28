"use client"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useWeb3 } from "../context/Web3Context"
import { motion, AnimatePresence } from "framer-motion"
import { Home, User, Stethoscope, FileText, Settings, Menu, X, Activity, Shield } from "lucide-react"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { account, userRole, isRegistered } = useWeb3()
  const location = useLocation()

  if (!account || !isRegistered) return null

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    ...(userRole === 1
      ? [
          { icon: User, label: "Patient Dashboard", path: "/patient" },
          { icon: FileText, label: "My Reports", path: "/patient#reports" },
          { icon: Shield, label: "Access Control", path: "/patient#access" },
        ]
      : []),
    ...(userRole === 2
      ? [
          { icon: Stethoscope, label: "Doctor Dashboard", path: "/doctor" },
          { icon: User, label: "My Patients", path: "/doctor#patients" },
          { icon: FileText, label: "Patient Reports", path: "/doctor#reports" },
        ]
      : []),
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      opacity: 0,
      x: -20,
    },
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 left-4 z-40 md:hidden p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-2xl z-50 md:relative md:translate-x-0"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Activity className="w-8 h-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">MedChain</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="md:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.path}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                          location.pathname === item.path
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* User Info */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {userRole === 1 ? (
                    <User className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Stethoscope className="w-6 h-6 text-green-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userRole === 1 ? "Patient" : "Doctor"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {account?.slice(0, 6)}...{account?.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
