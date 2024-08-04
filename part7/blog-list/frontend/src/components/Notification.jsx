import { useSelector } from 'react-redux'
import Alert from '@mui/material/Alert'

export const Notification = () => {
  const notification = useSelector(({ notification }) => notification)

  return (
    notification.message && (
      <Alert variant="filled" severity={`${notification.type}`}>
        {notification.message}
      </Alert>
    )
  )
}
