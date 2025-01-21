import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface TimeSlot {
  date: string;
  time: string;
}

export function CustomCalendly() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAvailableSlots()
  }, [])

  const fetchAvailableSlots = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('https://api.onehash.ai/v1/calendar/available-slots', {
        headers: {
          'Authorization': 'Bearer oh_cal_10192430fd8762017f01dc9a981ccbf4'
        }
      })
      if (response.ok) {
        const slots = await response.json()
        setAvailableSlots(slots)
      } else {
        throw new Error('Failed to fetch available slots')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available slots. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) {
      toast({
        title: "Error",
        description: "Please select a time slot.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('https://api.onehash.ai/v1/calendar/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer oh_cal_10192430fd8762017f01dc9a981ccbf4'
        },
        body: JSON.stringify({
          name,
          email,
          date: selectedSlot.date,
          time: selectedSlot.time
        })
      })

      if (response.ok) {
        toast({
          title: "Demo Scheduled",
          description: "Your demo has been successfully scheduled. We'll send you a confirmation email shortly.",
        })
        setName('')
        setEmail('')
        setSelectedSlot(null)
      } else {
        throw new Error('Failed to schedule demo')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule demo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Select
        value={selectedSlot ? `${selectedSlot.date}T${selectedSlot.time}` : ''}
        onValueChange={(value) => {
          const [date, time] = value.split('T')
          setSelectedSlot({ date, time })
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a time slot" />
        </SelectTrigger>
        <SelectContent>
          {availableSlots.map((slot, index) => (
            <SelectItem key={index} value={`${slot.date}T${slot.time}`}>
              {new Date(`${slot.date}T${slot.time}`).toLocaleString()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Scheduling...' : 'Schedule Demo'}
      </Button>
    </form>
  )
}

