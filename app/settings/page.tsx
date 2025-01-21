'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Bell, Shield, UserCircle, Mail } from 'lucide-react'
import { SettingsService, NotificationSetting, ProfileInfo } from '@/services/settings.service'
import { toast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Settings() {
  const { user, isLoading: authLoading, fetchProfile, isAuthenticated, signOut } = useAuth()
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({ username: '', role: '', company_name: '' })
  const [notifications, setNotifications] = useState<(NotificationSetting & { changed?: boolean })[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    async function fetchData() {
      if (authLoading) return;
      setIsLoading(true)
      try {
        const [notificationsData, profileData] = await Promise.all([
          SettingsService.getUserNotifications(),
          SettingsService.getProfileInfo()
        ])
        setNotifications(notificationsData)
        setProfileInfo(profileData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [authLoading])

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to Settings</h1>
          <p className="text-lg text-gray-600">
            Your settings will display here once you sign in.
          </p>
          <Button
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => window.location.href = '/auth'}
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading || authLoading) {
    return (
      <LoadingSpinner/>
    )
  }

  const validateField = (name: string, value: string) => {
    let error = ''
    switch (name) {
      case 'username':
        if (!value.trim()) error = 'Full Name is required'
        else if (value.length < 3) error = 'Full Name must be at least 3 characters'
        break
      case 'role':
        if (!value.trim()) error = 'Role is required'
        break
      case 'company_name':
        if (!value.trim()) error = 'Company Name is required'
        break
      case 'newEmail':
        if (!value.trim()) error = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format'
        break
      case 'newPassword':
        if (!value.trim()) error = 'Password is required'
        else if (value.length < 8) error = 'Password must be at least 8 characters'
        break
      case 'confirmPassword':
        if (!value.trim()) error = 'Confirm Password is required'
        else if (value !== newPassword) error = 'Passwords do not match'
        break
      default:
        break
    }
    return error
  }

  const handleProfileUpdate = async () => {
    const newErrors = {
      username: validateField('username', profileInfo.username),
      role: validateField('role', profileInfo.role),
      company_name: validateField('company_name', profileInfo.company_name),
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(error => error)) return

    try {
      const result = await SettingsService.updateProfileInfo({
        new_username: profileInfo.username,
        new_role: profileInfo.role,
        new_company_name: profileInfo.company_name
      })
      setProfileInfo(prevInfo => ({ ...prevInfo, ...result.updated_fields }))
      toast({
        title: "Success",
        description: "Profile information updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile information",
        variant: "destructive",
      })
    }
  }

  const handleEmailUpdateRequest = async () => {
    const emailError = validateField('newEmail', newEmail)
    if (emailError) {
      setErrors({ newEmail: emailError })
      return
    }

    try {
      await SettingsService.requestEmailUpdate(newEmail)
      toast({
        title: "Success",
        description: "Email update request sent",
      })
      await refetchUserProfile()
      setNewEmail('')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request email update",
        variant: "destructive",
      })
    }
  }

  const handleCancelEmailRequest = async () => {
    try {
      await SettingsService.cancelEmailUpdate();
      toast({
        title: "Success",
        description: "Email update request cancelled",
      });
      await refetchUserProfile();
    } catch (error) {
      console.error('Error canceling email update request:', error);
      if (error instanceof Error) {
        if (error.message === "NO_ACTIVE_REQUEST") {
          toast({
            title: "Info",
            description: "There is no active email update request to cancel.",
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to cancel email update request. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
      await refetchUserProfile();
    }
  };

  const refetchUserProfile = async () => {
    try {
      await fetchProfile();
    } catch (error) {
      console.error('Error refetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to refresh user profile. Please reload the page.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationToggle = (notificationTypeId: number, enabled: boolean) => {
    setNotifications(notifications.map(notification => 
      notification.notification_type_id === notificationTypeId 
        ? { ...notification, enabled, changed: true }
        : notification
    ))
  }

  const handleSaveNotifications = async () => {
    try {
      const updatedNotifications = notifications.filter(n => n.changed).map(({ notification_type_id, enabled }) => ({ notification_type_id, enabled }))
      await SettingsService.updateNotifications(updatedNotifications)
      setNotifications(notifications.map(n => ({ ...n, changed: false })))
      toast({
        title: "Success",
        description: "Notification settings updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      })
    }
  }

  const handlePasswordUpdate = async () => {
    const passwordError = validateField('newPassword', newPassword)
    const confirmPasswordError = validateField('confirmPassword', confirmPassword)
    if (passwordError || confirmPasswordError) {
      setErrors({ newPassword: passwordError, confirmPassword: confirmPasswordError })
      return
    }

    try {
      await SettingsService.updatePassword(newPassword)
      setNewPassword('')
      setConfirmPassword('')
      toast({
        title: "Success",
        description: "Password updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    }
  }

  const handleDisableAccount = async () => {
    try {
      await SettingsService.disableAccount()
      toast({
        title: "Account Disabled",
        description: "Your account has been successfully disabled",
      })
      signOut()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable account",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-white py-6 px-2 sm:px-6 lg:px-8">
      <div className="container max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Settings</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100/50">
                  <UserCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">Profile Information</CardTitle>
                  <CardDescription className="text-blue-600/80">
                    Manage your account details and preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-900">Full Name</label>
                <Input 
                  value={profileInfo.username} 
                  onChange={(e) => {
                    setProfileInfo(prev => ({ ...prev, username: e.target.value }))
                    setErrors(prev => ({ ...prev, username: '' }))
                  }}
                  className="border-blue-200 focus:border-blue-500 bg-white/50"
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-900">Company</label>
                <Input 
                  value={profileInfo.company_name} 
                  onChange={(e) => {
                    setProfileInfo(prev => ({ ...prev, company_name: e.target.value }))
                    setErrors(prev => ({ ...prev, company_name: '' }))
                  }}
                  className="border-blue-200 focus:border-blue-500 bg-white/50"
                />
                {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-900">Role</label>
                <Input 
                  value={profileInfo.role} 
                  onChange={(e) => {
                    setProfileInfo(prev => ({ ...prev, role: e.target.value }))
                    setErrors(prev => ({ ...prev, role: '' }))
                  }}
                  className="border-blue-200 focus:border-blue-500 bg-white/50"
                />
                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-white to-blue-50 border-t border-blue-50">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleProfileUpdate}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100/50">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">Email Settings</CardTitle>
                  <CardDescription className="text-blue-600/80">
                    Manage your email address
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-900">Current Email</label>
                <Input 
                  value={user?.email} 
                  disabled 
                  className="border-blue-200 bg-blue-50/50"
                />
              </div>
              {user?.new_requested_email ? (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-800">Email update requested for: <span className="font-medium">{user.new_requested_email}</span></p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-900">New Email</label>
                  <Input 
                    placeholder="Enter new email" 
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value)
                      setErrors(prev => ({ ...prev, newEmail: '' }))
                    }}
                    className="border-blue-200 focus:border-blue-500 bg-white/50"
                  />
                  {errors.newEmail && <p className="text-sm text-red-500">{errors.newEmail}</p>}
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-white to-blue-50 border-t border-blue-50">
              {user?.new_requested_email ? (
                <Button 
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={handleCancelEmailRequest}
                >
                  Cancel Email Update Request
                </Button>
              ) : (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleEmailUpdateRequest}
                  disabled={!newEmail}
                >
                  Request Email Update
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card className="border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100/50">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">Notifications</CardTitle>
                  <CardDescription className="text-blue-600/80">
                    Configure how you want to be notified
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {notifications.map((notification) => (
                <div key={notification.notification_type_id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-transparent border border-blue-100">
                  <div className="space-y-0.5">
                    <div className="font-medium text-blue-900">{notification.name}</div>
                    <div className="text-sm text-blue-600/80">
                      {notification.description}
                    </div>
                  </div>
                  <Switch 
                    checked={notification.enabled}
                    onCheckedChange={(checked) => 
                      handleNotificationToggle(notification.notification_type_id, checked)
                    }
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-white to-blue-50 border-t border-blue-50">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveNotifications}
                disabled={!notifications.some(n => n.changed)}
              >
                Save Notification Changes
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100/50">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">Security</CardTitle>
                  <CardDescription className="text-blue-600/80">
                    Manage your security preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-900">New Password</label>
                <Input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setErrors(prev => ({ ...prev, newPassword: '' }))
                  }}
                  className="border-blue-200 focus:border-blue-500 bg-white/50"
                />
                {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-900">Confirm New Password</label>
                <Input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setErrors(prev => ({ ...prev, confirmPassword: '' }))
                  }}
                  className="border-blue-200 focus:border-blue-500 bg-white/50"
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-white to-blue-50 border-t border-blue-50">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handlePasswordUpdate}
                disabled={!newPassword || !confirmPassword}
              >
                Update Password
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2 border-red-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="border-b border-red-50 bg-gradient-to-r from-red-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100/50">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription className="text-red-600/80">
                    Irreversible account actions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-red-600/80">
                Disabling your account will deactivate it. It can be reactivated after submitting a support request.
              </p>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-white to-red-50 border-t border-red-50">
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
                    Disable Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently disable your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleDisableAccount}
                    >
                      Disable Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}