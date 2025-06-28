"use client"
import { Link } from "react-router-dom"
import { useWeb3 } from "../context/Web3Context"
import { motion } from "framer-motion"
import { Shield, FileText, Users, Zap, Lock, Globe, ArrowRight, Star } from "lucide-react"

const Home = () => {
  const { account, connectWallet, isRegistered, userRole, loading } = useWeb3()

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Blockchain Security",
      description:
        "Your medical reports are secured by blockchain technology, ensuring immutable and tamper-proof records.",
      color: "blue",
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      title: "IPFS Storage",
      description: "Reports are stored on IPFS for decentralized, permanent, and accessible file storage.",
      color: "green",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Access Control",
      description:
        "Patients have full control over who can access their medical reports with smart contract permissions.",
      color: "purple",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Instant Access",
      description: "Authorized doctors can instantly access patient reports from anywhere in the world.",
      color: "yellow",
    },
    {
      icon: <Lock className="w-8 h-8 text-red-600" />,
      title: "Privacy First",
      description: "Your data remains private and is only accessible to explicitly authorized healthcare providers.",
      color: "red",
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "Global Access",
      description: "Access your medical reports from anywhere, enabling seamless healthcare across borders.",
      color: "indigo",
    },
  ]

  const getDashboardLink = () => {
    if (!account) return null
    if (!isRegistered) return "/register"
    if (userRole === 1) return "/patient"
    if (userRole === 2) return "/doctor"
    return "/register"
  }

  const getDashboardText = () => {
    if (!account) return "Connect Wallet to Get Started"
    if (!isRegistered) return "Complete Registration"
    if (userRole === 1) return "Go to Patient Dashboard"
    if (userRole === 2) return "Go to Doctor Dashboard"
    return "Complete Registration"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900 py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute top-10 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute top-40 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30"
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute bottom-10 left-1/2 w-72 h-72 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30"
          />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Medical Report Distribution
              <motion.span
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                Using Blockchain
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Secure, decentralized, and patient-controlled medical report management system. Upload your reports, control
            access, and enable seamless healthcare collaboration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            {account ? (
              <Link to={getDashboardLink()}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl flex items-center space-x-2"
                >
                  <span>{getDashboardText()}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                disabled={loading}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl flex items-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? "Connecting..." : "Connect Wallet to Get Started"}</span>
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </motion.button>
            )}

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#features"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white rounded-2xl text-lg font-semibold transition-all duration-300 hover:shadow-xl"
            >
              Learn More
            </motion.a>
          </motion.div>

          {account && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="inline-block p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Connected Wallet</p>
              <p className="font-mono text-blue-600 dark:text-blue-400 text-lg">
                {account.slice(0, 8)}...{account.slice(-8)}
              </p>
              {isRegistered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center mt-3 text-green-600 dark:text-green-400"
                >
                  <Star className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    Registered as {userRole === 1 ? "Patient" : userRole === 2 ? "Doctor" : "Unknown"}
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Why Choose MedChain?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built with cutting-edge blockchain technology to revolutionize medical record management
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
                className="group p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              >
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="mb-6">
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple steps to secure and share your medical reports
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "1",
                title: "Connect & Register",
                description: "Connect your MetaMask wallet and register as either a Patient or Doctor",
                color: "blue",
              },
              {
                step: "2",
                title: "Upload Reports",
                description: "Patients upload medical reports which are securely stored on IPFS",
                color: "green",
              },
              {
                step: "3",
                title: "Control Access",
                description: "Grant or revoke access to doctors using blockchain smart contracts",
                color: "purple",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants} className="text-center group">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-20 h-20 bg-gradient-to-r from-${item.color}-600 to-${item.color}-700 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  {item.step}
                </motion.div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl font-bold text-white mb-6">Ready to Secure Your Medical Records?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of patients and doctors who trust MedChain for secure medical record management
            </p>

            {!account ? (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                className="px-10 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl"
              >
                Get Started Now
              </motion.button>
            ) : (
              <Link to={getDashboardLink()}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl"
                >
                  Go to Dashboard
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Home
