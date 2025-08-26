import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export interface AppError {
  type: 'network' | 'api' | 'validation' | 'generic'
  message: string
  code?: string | number
  details?: any
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<Record<string, AppError>>({})
  const { toast } = useToast()

  const setError = useCallback((key: string, error: AppError) => {
    setErrors(prev => ({ ...prev, [key]: error }))
    
    if (error.type === 'network' || error.type === 'api') {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      })
    }
  }, [toast])

  const clearError = useCallback((key: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[key]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  const getError = useCallback((key: string) => {
    return errors[key] || null
  }, [errors])

  const hasError = useCallback((key?: string) => {
    if (key) {
      return !!errors[key]
    }
    return Object.keys(errors).length > 0
  }, [errors])

  const createNetworkError = useCallback((message = 'Erro de conexão com a internet') => ({
    type: 'network' as const,
    message
  }), [])

  const createApiError = useCallback((message = 'Erro na API', code?: string | number) => ({
    type: 'api' as const,
    message,
    code
  }), [])

  const createValidationError = useCallback((message = 'Dados inválidos') => ({
    type: 'validation' as const,
    message
  }), [])

  return {
    errors,
    setError,
    clearError,
    clearAllErrors,
    getError,
    hasError,
    createNetworkError,
    createApiError,
    createValidationError
  }
}

export function useRetry(fn: () => Promise<void>, maxAttempts = 3) {
  const [attempts, setAttempts] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const retry = useCallback(async () => {
    if (attempts >= maxAttempts) {
      return false 
    }

    setIsRetrying(true)
    setAttempts(prev => prev + 1)

    try {
      await fn()
      setAttempts(0) 
      return true
    } catch (error) {
      if (attempts + 1 >= maxAttempts) {
        return false 
      }
      
      const delay = Math.pow(2, attempts) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
      
      return retry()
    } finally {
      setIsRetrying(false)
    }
  }, [fn, attempts, maxAttempts])

  const reset = useCallback(() => {
    setAttempts(0)
    setIsRetrying(false)
  }, [])

  return {
    retry,
    reset,
    attempts,
    isRetrying,
    canRetry: attempts < maxAttempts
  }
}

