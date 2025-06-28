"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your MedChain assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const faqData = {
    "how do i upload a report": {
      answer:
        "To upload a report:\n1. Go to your Patient Dashboard\n2. Click the 'Upload Report' button\n3. Select your PDF or image file\n4. Click 'Upload' to store it on IPFS\n5. Confirm the blockchain transaction",
      followUp: "Would you like to know about granting access to doctors?",
    },
    "how can i grant access to a doctor": {
      answer:
        "To grant access to a doctor:\n1. Go to your Patient Dashboard\n2. Click 'Grant Access' button\n3. Enter the doctor's wallet address\n4. Confirm the transaction\n5. The doctor will now be able to view your reports",
      followUp: "You can revoke access anytime from the same dashboard.",
    },
    "what is ipfs": {
      answer:
        "IPFS (InterPlanetary File System) is a decentralized storage network that:\n• Stores your files across multiple nodes\n• Ensures your data is always accessible\n• Provides content addressing for security\n• Cannot be censored or taken down",
      followUp: "Your medical reports are stored securely on IPFS and linked to the blockchain.",
    },
    "how do i revoke access": {
      answer:
        "To revoke doctor access:\n1. Go to 'Authorized Doctors' section\n2. Find the doctor you want to remove\n3. Click the 'Revoke' button next to their address\n4. Confirm the blockchain transaction",
      followUp: "The doctor will immediately lose access to your reports.",
    },
    "what is metamask": {
      answer:
        "MetaMask is a cryptocurrency wallet that:\n• Connects your browser to the blockchain\n• Manages your Ethereum accounts\n• Signs transactions securely\n• Is required to use MedChain",
      followUp: "Make sure you have MetaMask installed and connected to use all features.",
    },
    "how do doctors view reports": {
      answer:
        "Doctors can view reports by:\n1. Connecting their MetaMask wallet\n2. Registering as a Doctor\n3. Accessing their Doctor Dashboard\n4. Selecting a patient who granted them access\n5. Viewing the patient's reports",
      followUp: "Doctors can only see reports from patients who explicitly granted them access.",
    },
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findBestMatch = (input) => {
    const lowercaseInput = input.toLowerCase()
    const keywords = Object.keys(faqData)

    for (const keyword of keywords) {
      if (lowercaseInput.includes(keyword) || keyword.includes(lowercaseInput)) {
        return faqData[keyword]
      }
    }

    // Check for partial matches
    for (const keyword of keywords) {
      const keywordWords = keyword.split(" ")
      const inputWords = lowercaseInput.split(" ")
      const matchCount = keywordWords.filter((word) => inputWords.includes(word)).length

      if (matchCount >= 2) {
        return faqData[keyword]
      }
    }

    return null
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const match = findBestMatch(inputText)

      let botResponse
      if (match) {
        botResponse = {
          id: Date.now() + 1,
          text: match.answer,
          sender: "bot",
          timestamp: new Date(),
          followUp: match.followUp,
        }
      } else {
        botResponse = {
          id: Date.now() + 1,
          text: "I'm not sure about that. Here are some things I can help you with:\n\n• How to upload a report\n• How to grant access to doctors\n• What is IPFS\n• How to revoke access\n• What is MetaMask\n• How doctors view reports\n\nTry asking about any of these topics!",
          sender: "bot",
          timestamp: new Date(),
        }
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)

      // Add follow-up message if available
      if (match?.followUp) {
        setTimeout(() => {
          const followUpMessage = {
            id: Date.now() + 2,
            text: match.followUp,
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, followUpMessage])
        }, 1000)
      }
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const chatVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  }

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
      >
        <MessageCircle className="w-6 h-6" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-30"
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
            />

            {/* Chat Container */}
            <motion.div
              variants={chatVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">MedChain Assistant</h3>
                    <p className="text-xs opacity-90">Always here to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {message.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl">
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about MedChain..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot
