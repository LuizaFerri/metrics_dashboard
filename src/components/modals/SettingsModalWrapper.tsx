import { SettingsModal } from "@/components/common/SettingsModal"
import { useUserPreferences } from "@/hooks/useUserPreferences"

interface SettingsModalWrapperProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModalWrapper = ({
  isOpen,
  onClose
}: SettingsModalWrapperProps) => {
  const {
    preferences,
    savePreferences,
    resetPreferences
  } = useUserPreferences()

  return (
    <SettingsModal
      isOpen={isOpen}
      onClose={onClose}
      preferences={preferences}
      onSave={savePreferences}
      onReset={resetPreferences}
    />
  )
}
