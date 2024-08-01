import { useSelector } from 'react-redux'

export const Notification = () => {
  const notification = useSelector(({ notification }) => notification)

  return notification.message && <div className={`message ${notification.type}`}>{notification.message}</div>
}
