import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, renderHook } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import type { Session, User } from '@supabase/supabase-js'

// Mock the supabase module
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    }
  }
}))

import { supabase } from '../../lib/supabase'

describe('AuthProvider', () => {
  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {}
  } as User

  const mockSession: Session = {
    access_token: 'test-token',
    refresh_token: 'refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: mockUser
  } as Session

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Provider Initialization', () => {
    it('should initialize with loading state', async () => {
      const unsubscribeMock = vi.fn()
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      } as any)

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })

    it('should load existing session on mount', async () => {
      const unsubscribeMock = vi.fn()
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      } as any)

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.session).toEqual(mockSession)
        expect(result.current.user).toEqual(mockUser)
        expect(result.current.loading).toBe(false)
      })
    })

    it('should handle no session on mount', async () => {
      const unsubscribeMock = vi.fn()
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      } as any)

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.session).toBeNull()
        expect(result.current.user).toBeNull()
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      const unsubscribeMock = vi.fn()
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      } as any)
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await result.current.signIn('test@example.com', 'password123')

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    it('should throw error on failed sign in', async () => {
      const unsubscribeMock = vi.fn()
      const mockError = new Error('Invalid credentials')
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      } as any)
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError as any
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await expect(
        result.current.signIn('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials')
    })
  })

  describe('signUp', () => {
    it('should successfully sign up with valid credentials', async () => {
      const unsubscribeMock = vi.fn()
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      } as any)
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await result.current.signUp('newuser@example.com', 'password123')

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123'
      })
    })

    it('should throw error on failed sign up', async () => {
      const unsubscribeMock = vi.fn()
      const mockError = new Error('Email already exists')
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      } as any)
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError as any
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await expect(
        result.current.signUp('existing@example.com', 'password123')
      ).rejects.toThrow('Email already exists')
    })
  })

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      const unsubscribeMock = vi.fn()
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      } as any)
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await result.current.signOut()

      expect(supabase.auth.signOut).toHaveBeenCalled()
    })

    it('should throw error on failed sign out', async () => {
      const unsubscribeMock = vi.fn()
      const mockError = new Error('Sign out failed')
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      } as any)
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: mockError as any
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await expect(result.current.signOut()).rejects.toThrow('Sign out failed')
    })
  })

  describe('Auth State Changes', () => {
    it('should update state on auth state change', async () => {
      const unsubscribeMock = vi.fn()
      let authCallback: any

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
        authCallback = callback
        return {
          data: { subscription: { unsubscribe: unsubscribeMock } }
        } as any
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Simulate auth state change
      authCallback('SIGNED_IN', mockSession)

      await waitFor(() => {
        expect(result.current.session).toEqual(mockSession)
        expect(result.current.user).toEqual(mockUser)
      })
    })

    it('should clear state on sign out event', async () => {
      const unsubscribeMock = vi.fn()
      let authCallback: any

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
        authCallback = callback
        return {
          data: { subscription: { unsubscribe: unsubscribeMock } }
        } as any
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.session).toEqual(mockSession)
      })

      // Simulate sign out
      authCallback('SIGNED_OUT', null)

      await waitFor(() => {
        expect(result.current.session).toBeNull()
        expect(result.current.user).toBeNull()
      })
    })
  })

  describe('useAuth Hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within AuthProvider')
    })

    it('should provide auth context when used within AuthProvider', async () => {
      const unsubscribeMock = vi.fn()
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      } as any)

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current).toHaveProperty('session')
      expect(result.current).toHaveProperty('user')
      expect(result.current).toHaveProperty('signIn')
      expect(result.current).toHaveProperty('signUp')
      expect(result.current).toHaveProperty('signOut')
      expect(result.current).toHaveProperty('loading')
    })
  })

  describe('Cleanup', () => {
    it('should unsubscribe from auth changes on unmount', async () => {
      const unsubscribeMock = vi.fn()
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      } as any)

      const { unmount } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(supabase.auth.onAuthStateChange).toHaveBeenCalled()
      })

      unmount()

      expect(unsubscribeMock).toHaveBeenCalled()
    })
  })
})
