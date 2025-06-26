"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "../context/Web3Context"
import { Users, FileText, Eye, Calendar, User, Activity } from "lucide-react"
import toast from "react-hot-toast"

const DoctorDashboard = () => {
  const { account, getMyPatients, getPatientReports } = useWeb3()
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientReports, setPatientReports] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPatients()
  }, [account])

  const loadPatients = async () => {
    try {
      const patientsData = await getMyPatients()
      setPatients(patientsData)
    } catch (error) {
      console.error("Error loading patients:", error)
    }
  }

  const loadPatientReports = async (patientAddress) => {
    try {
      setLoading(true)
      const reports = await getPatientReports(patientAddress)
      setPatientReports(reports)
      setSelectedPatient(patientAddress)
    } catch (error) {
      console.error("Error loading patient reports:", error)
      toast.error("Failed to load patient reports")
    } finally {
      setLoading(false)
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctor Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Access patient reports with granted permissions</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="text-green-800 dark:text-green-300 font-medium">Active Doctor</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{patients.length}</p>
              <p className="text-gray-600 dark:text-gray-300">Accessible Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{patientReports.length}</p>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedPatient ? "Patient Reports" : "Total Reports"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPatient ? "1" : "0"}</p>
              <p className="text-gray-600 dark:text-gray-300">Selected Patient</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Patients List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Patients</h2>
            </div>
            <div className="p-6">
              {patients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No patients have granted you access yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patients.map((patient, index) => (
                    <div
                      key={index}
                      onClick={() => loadPatientReports(patient)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPatient === patient
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <User className="w-6 h-6 text-blue-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Patient #{index + 1}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">{patient}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Patient Reports */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedPatient ? "Patient Reports" : "Select a Patient"}
              </h2>
              {selectedPatient && (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">{selectedPatient}</p>
              )}
            </div>
            <div className="p-6">
              {!selectedPatient ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a patient from the list to view their medical reports.
                  </p>
                </div>
              ) : loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading patient reports...</p>
                </div>
              ) : patientReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">This patient has no reports uploaded yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {patientReports.map((report, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-6 h-6 text-blue-600" />
                          <span className="font-medium text-gray-900 dark:text-white">Report #{index + 1}</span>
                        </div>
                        <button
                          onClick={() => viewReport(report.ipfsHash)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(report.timestamp)}
                        </div>

                        <div className="text-xs text-gray-400 font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          IPFS: {report.ipfsHash}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
