"use client"
import { Link } from "react-router-dom"
import { useWeb3 } from "../context/Web3Context"
import { Shield, FileText, Users, Zap, Lock, Globe } from "lucide-react"

const Home = () => {
  const { account, connectWallet, isRegistered, userRole } = useWeb3()

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Blockchain Security",
      description:
        "Your medical reports are secured by blockchain technology, ensuring immutable and tamper-proof records.",
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      title: "IPFS Storage",
      description: "Reports are stored on IPFS for decentralized, permanent, and accessible file storage.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Access Control",
      description:
        "Patients have full control over who can access their medical reports with smart contract permissions.",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Instant Access",
      description: "Authorized doctors can instantly access patient reports from anywhere in the world.",
    },
    {
      icon: <Lock className="w-8 h-8 text-red-600" />,
      title: "Privacy First",
      description: "Your data remains private and is only accessible to explicitly authorized healthcare providers.",
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "Global Access",
      description: "Access your medical reports from anywhere, enabling seamless healthcare across borders.",
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Medical Report Distribution
            <span className="block text-blue-600 dark:text-blue-400">Using Blockchain</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Secure, decentralized, and patient-controlled medical report management system. Upload your reports, control
            access, and enable seamless healthcare collaboration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {account ? (
              <Link
                to={getDashboardLink()}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors"
              >
                {getDashboardText()}
              </Link>
            ) : (
              <button
                onClick={connectWallet}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors"
              >
                Connect Wallet to Get Started
              </button>
            )}

            <a
              href="#features"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-lg font-semibold transition-colors"
            >
              Learn More
            </a>
          </div>

          {account && (
            <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md inline-block">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connected: <span className="font-mono text-blue-600 dark:text-blue-400">{account}</span>
              </p>
              {isRegistered && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  ✓ Registered as {userRole === 1 ? "Patient" : userRole === 2 ? "Doctor" : "Unknown"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose MedChain?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with cutting-edge blockchain technology to revolutionize medical record management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple steps to secure and share your medical reports
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Connect & Register</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect your MetaMask wallet and register as either a Patient or Doctor
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Upload Reports</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Patients upload medical reports which are securely stored on IPFS
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Control Access</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Grant or revoke access to doctors using blockchain smart contracts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Secure Your Medical Records?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and doctors who trust MedChain for secure medical record management
          </p>

          {!account ? (
            <button
              onClick={connectWallet}
              className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg text-lg font-semibold transition-colors"
            >
              Get Started Now
            </button>
          ) : (
            <Link
              to={getDashboardLink()}
              className="inline-block px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg text-lg font-semibold transition-colors"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
