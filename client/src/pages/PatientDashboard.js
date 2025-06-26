"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "../context/Web3Context"
import { Upload, FileText, Users, Plus, Trash2, Eye, Calendar, Share } from "lucide-react"
import toast from "react-hot-toast"

const PatientDashboard = () => {
  const { account, getMyReports, getMyDoctors, grantAccess, revokeAccess, uploadReport, loading } = useWeb3()
  const [reports, setReports] = useState([])
  const [doctors, setDoctors] = useState([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showGrantModal, setShowGrantModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [doctorAddress, setDoctorAddress] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [account])

  const loadData = async () => {
    try {
      const [reportsData, doctorsData] = await Promise.all([getMyReports(), getMyDoctors()])
      setReports(reportsData)
      setDoctors(doctorsData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file")
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("walletAddress", account)
      formData.append("fileName", selectedFile.name)

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        await uploadReport(result.ipfsHash)
        await loadData()
        setShowUploadModal(false)
        setSelectedFile(null)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  const handleGrantAccess = async () => {
    if (!doctorAddress) {
      toast.error("Please enter doctor address")
      return
    }

    try {
      await grantAccess(doctorAddress)
      await loadData()
      setShowGrantModal(false)
      setDoctorAddress("")
    } catch (error) {
      console.error("Grant access error:", error)
    }
  }

  const handleRevokeAccess = async (doctor) => {
    try {
      await revokeAccess(doctor)
      await loadData()
    } catch (error) {
      console.error("Revoke access error:", error)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const viewReport = (ipfsHash) => {
    window.open(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, "_blank")
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your medical reports and doctor access</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Report</span>
            </button>
            <button
              onClick={() => setShowGrantModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Grant Access</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.length}</p>
              <p className="text-gray-600 dark:text-gray-300">Total Reports</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{doctors.length}</p>
              <p className="text-gray-600 dark:text-gray-300">Authorized Doctors</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Share className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.length * doctors.length}</p>
              <p className="text-gray-600 dark:text-gray-300">Total Shares</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Medical Reports</h2>
        </div>
        <div className="p-6">
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No reports uploaded yet. Upload your first medical report to get started.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <button
                      onClick={() => viewReport(report.ipfsHash)}
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Report #{index + 1}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(report.timestamp)}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-mono truncate">{report.ipfsHash}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Authorized Doctors Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Authorized Doctors</h2>
        </div>
        <div className="p-6">
          {doctors.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No doctors have access yet. Grant access to doctors to share your reports.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.map((doctor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-green-600" />
                    <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{doctor}</span>
                  </div>
                  <button
                    onClick={() => handleRevokeAccess(doctor)}
                    disabled={loading}
                    className="flex items-center space-x-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Revoke</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Medical Report</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select File (PDF or Image)
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {selectedFile && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>File:</strong> {selectedFile.name}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedFile(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                disabled={!selectedFile || uploading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grant Access Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grant Doctor Access</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Doctor's Wallet Address
              </label>
              <input
                type="text"
                value={doctorAddress}
                onChange={(e) => setDoctorAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowGrantModal(false)
                  setDoctorAddress("")
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGrantAccess}
                disabled={!doctorAddress || loading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Granting..." : "Grant Access"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientDashboard
