// 'use client'

// import { useAuth } from '@/contexts/AuthContext'
// import { useState, useEffect } from 'react'
// import AuthSlider from './AuthSlider'

// interface ConditionalAuthProps {
//   children: React.ReactNode
// }

// const ConditionalAuth: React.FC<ConditionalAuthProps> = ({ children }) => {
//   const { user, isLoading } = useAuth()
//   const [showAuth, setShowAuth] = useState(false)

//   useEffect(() => {
//     if (!isLoading && !user) {
//       const handleClick = (e: MouseEvent) => {
//         const target = e.target as HTMLElement
//         if (target.tagName === 'BUTTON' || target.closest('button')) {
//           e.preventDefault()
//           setShowAuth(true)
//         }
//       }

//       document.addEventListener('click', handleClick)

//       return () => {
//         document.removeEventListener('click', handleClick)
//       }
//     }
//   }, [isLoading, user])

//   if (isLoading) {
//     return <div>Loading...</div>
//   }

//   if (showAuth) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white p-4 rounded-lg max-w-md w-full">
//           <h2 className="text-xl font-bold mb-4">Sign in Required</h2>
//           <p className="mb-4">You need to sign in to use these functionalities.</p>
//           <AuthSlider />
//           <button
//             onClick={() => setShowAuth(false)}
//             className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return <>{children}</>
// }

// export default ConditionalAuth

