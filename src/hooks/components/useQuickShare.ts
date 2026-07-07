'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSendQuickShareMutation } from 'src/api/quickShareApi'

export interface QuickShareFormData {
  email: string
  subject: string
  body: string
  phone?: string
}

export const useQuickShare = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [sendQuickShare, { isLoading: isQuickSharing }] = useSendQuickShareMutation()

  const handleShareClick = () => setIsShareModalOpen(true)

  const handleSendConfirmation = async (data: QuickShareFormData) => {
    try {
      const channel = data.phone
        ? data.phone.includes('whatsapp')
          ? 'whatsapp'
          : 'sms'
        : 'email'

      await sendQuickShare({
        email: data.email,
        subject: data.subject,
        message: data.body,
        channel,
        ...(data.phone ? { phone: data.phone } : {}),
      }).unwrap()

      toast.success('Quick share sent successfully!')
    } catch (error: unknown) {
      let errorMessage = 'Failed to send quick share'

      if (typeof error === 'object' && error !== null) {
        if ('status' in error) {
          const apiError = error as { status: number; data?: any }
          errorMessage = apiError.data?.message || errorMessage

          if (apiError.status === 401) {
            toast.error('Please sign in to perform this action')
            return
          }
        } else if ('message' in error) {
          errorMessage = (error as Error).message
        }
      }

      toast.error(errorMessage)
      console.error('API error details:', error)
    } finally {
      setIsShareModalOpen(false)
    }
  }

  return {
    isShareModalOpen,
    setIsShareModalOpen,
    isQuickSharing,
    handleShareClick,
    handleSendConfirmation,
  }
}