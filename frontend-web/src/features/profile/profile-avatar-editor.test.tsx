import { QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestQueryClient } from '../../test/query-client'
import { ProfileAvatarEditor } from './profile-avatar-editor'

const patchMock = vi.fn()
const deleteMock = vi.fn()
const refreshUserMock = vi.fn().mockResolvedValue(undefined)

vi.mock('../../lib/api', () => ({
  api: {
    patch: (...args: unknown[]) => patchMock(...args),
    delete: (...args: unknown[]) => deleteMock(...args),
  },
  getApiErrorMessage: () => 'api-error',
}))

function renderEditor(avatarUrl: string | null = null) {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfileAvatarEditor
        fullName="Doctor Demo"
        avatarUrl={avatarUrl}
        queryKey={['doctor-profile', 'me']}
        refreshUser={refreshUserMock}
      />
    </QueryClientProvider>,
  )
}

describe('ProfileAvatarEditor', () => {
  beforeEach(() => {
    patchMock.mockReset()
    deleteMock.mockReset()
    refreshUserMock.mockClear()
    patchMock.mockResolvedValue({ data: { user: { id: 'u-1', avatarUrl: 'https://img/new.png' } } })
    deleteMock.mockResolvedValue({ data: { user: { id: 'u-1', avatarUrl: null } } })
  })

  it('shows add icon when no avatar exists', () => {
    renderEditor(null)
    expect(screen.getByRole('button', { name: 'Add photo' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove photo' })).not.toBeInTheDocument()
  })

  it('shows edit and remove icons when avatar exists', () => {
    renderEditor('https://img/existing.png')
    expect(screen.getByRole('button', { name: 'Edit photo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove photo' })).toBeInTheDocument()
  })

  it('uploads immediately after selecting image file', async () => {
    renderEditor('https://img/existing.png')
    const fileInput = document.getElementById('profile-avatar-file') as HTMLInputElement
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' })

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledTimes(1)
      expect(patchMock.mock.calls[0]?.[0]).toBe('/users/me/avatar')
    })
  })

  it('removes current avatar on delete click', async () => {
    renderEditor('https://img/existing.png')
    fireEvent.click(screen.getByRole('button', { name: 'Remove photo' }))

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith('/users/me/avatar')
    })
  })
})
