"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { ethers } from "ethers"
import toast from "react-hot-toast"
import MedicalReportSystemABI from "../contracts/MedicalReportSystem.json"

const Web3Context = createContext()

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState("")
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(false)

  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || MedicalReportSystemABI.address

  useEffect(() => {
    checkWalletConnection()
  }, [])

  useEffect(() => {
    if (account && contract) {
      checkUserRegistration()
    }
  }, [account, contract])

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          await connectWallet()
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed!")
      return
    }

    try {
      setLoading(true)
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MedicalReportSystemABI.abi, signer)

      setAccount(accounts[0])
      setProvider(provider)
      setSigner(signer)
      setContract(contract)

      toast.success("Wallet connected successfully!")
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast.error("Failed to connect wallet")
    } finally {
      setLoading(false)
    }
  }

  const checkUserRegistration = async () => {
    try {
      const [role, registered] = await contract.getUser(account)
      setUserRole(Number(role))
      setIsRegistered(registered)
    } catch (error) {
      console.error("Error checking user registration:", error)
    }
  }

  const registerUser = async (role) => {
    if (!contract) return

    try {
      setLoading(true)
      const tx = await contract.register(role)
      await tx.wait()

      setUserRole(role)
      setIsRegistered(true)
      toast.success("Registration successful!")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const uploadReport = async (ipfsHash) => {
    if (!contract) return

    try {
      setLoading(true)
      const tx = await contract.uploadReport(ipfsHash)
      await tx.wait()
      toast.success("Report uploaded successfully!")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload report")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const grantAccess = async (doctorAddress) => {
    if (!contract) return

    try {
      setLoading(true)
      const tx = await contract.grantAccess(doctorAddress)
      await tx.wait()
      toast.success("Access granted successfully!")
    } catch (error) {
      console.error("Grant access error:", error)
      toast.error("Failed to grant access")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const revokeAccess = async (doctorAddress) => {
    if (!contract) return

    try {
      setLoading(true)
      const tx = await contract.revokeAccess(doctorAddress)
      await tx.wait()
      toast.success("Access revoked successfully!")
    } catch (error) {
      console.error("Revoke access error:", error)
      toast.error("Failed to revoke access")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getMyReports = async () => {
    if (!contract) return []

    try {
      const reports = await contract.getMyReports()
      return reports.map((report) => ({
        ipfsHash: report.ipfsHash,
        timestamp: Number(report.timestamp),
        patient: report.patient,
        isActive: report.isActive,
      }))
    } catch (error) {
      console.error("Error getting reports:", error)
      return []
    }
  }

  const getPatientReports = async (patientAddress) => {
    if (!contract) return []

    try {
      const reports = await contract.getPatientReports(patientAddress)
      return reports.map((report) => ({
        ipfsHash: report.ipfsHash,
        timestamp: Number(report.timestamp),
        patient: report.patient,
        isActive: report.isActive,
      }))
    } catch (error) {
      console.error("Error getting patient reports:", error)
      return []
    }
  }

  const getMyDoctors = async () => {
    if (!contract) return []

    try {
      return await contract.getMyDoctors()
    } catch (error) {
      console.error("Error getting doctors:", error)
      return []
    }
  }

  const getMyPatients = async () => {
    if (!contract) return []

    try {
      return await contract.getMyPatients()
    } catch (error) {
      console.error("Error getting patients:", error)
      return []
    }
  }

  const value = {
    account,
    provider,
    signer,
    contract,
    userRole,
    isRegistered,
    loading,
    connectWallet,
    registerUser,
    uploadReport,
    grantAccess,
    revokeAccess,
    getMyReports,
    getPatientReports,
    getMyDoctors,
    getMyPatients,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}
