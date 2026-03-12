import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { api, getApiErrorMessage } from '../../lib/api'

type ProfileAvatarEditorProps = {
  fullName?: string | null
  avatarUrl?: string | null
  queryKey: readonly unknown[]
  refreshUser: () => Promise<void>
}

function initialsFromName(name?: string | null) {
  const trimmed = name?.trim() ?? ''
  if (!trimmed) return 'U'
  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? '')
    .join('')
}

export function ProfileAvatarEditor({
  fullName,
  avatarUrl,
  queryKey,
  refreshUser,
}: ProfileAvatarEditorProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const initials = useMemo(() => initialsFromName(fullName), [fullName])

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return (await api.patch('/users/me/avatar', formData)).data
    },
    onSuccess: async () => {
      setError(null)
      setStatus('Profile picture updated.')
      await queryClient.invalidateQueries({ queryKey })
      await refreshUser()
    },
    onError: (err) => {
      setStatus(null)
      setError(getApiErrorMessage(err))
    },
  })

  const removeMutation = useMutation({
    mutationFn: async () => (await api.delete('/users/me/avatar')).data,
    onSuccess: async () => {
      setError(null)
      setStatus('Profile picture removed.')
      await queryClient.invalidateQueries({ queryKey })
      await refreshUser()
    },
    onError: (err) => {
      setStatus(null)
      setError(getApiErrorMessage(err))
    },
  })

  const openPicker = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="profile-avatar-editor">
      <div className="profile-avatar-shell">
        <div className="profile-avatar-preview">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="profile-avatar-overlay">
          <button
            type="button"
            className="profile-avatar-icon"
            aria-label={avatarUrl ? 'Edit photo' : 'Add photo'}
            disabled={uploadMutation.isPending || removeMutation.isPending}
            onClick={openPicker}
          >
            {avatarUrl ? <Pencil size={14} /> : <Plus size={14} />}
          </button>
          {avatarUrl ? (
            <button
              type="button"
              className="profile-avatar-icon danger"
              aria-label="Remove photo"
              disabled={removeMutation.isPending || uploadMutation.isPending}
              onClick={() => removeMutation.mutate()}
            >
              <Trash2 size={14} />
            </button>
          ) : null}
        </div>
      </div>
      <input
        ref={fileInputRef}
        id="profile-avatar-file"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="profile-avatar-hidden-input"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.currentTarget.value = ''
          if (!file) return
          setStatus(null)
          setError(null)
          uploadMutation.mutate(file)
        }}
      />
      <div className="profile-avatar-actions">
        {status ? <p>{status}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </div>
    </div>
  )
}
