import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password }) => {
  return (
    <Box component="form" onSubmit={handleSubmit} mt={4}>
      <FormControl>
        <TextField
          type="text"
          data-testid="username"
          value={username}
          name="Username"
          label="Username"
          onChange={handleUsernameChange}
        />
        <TextField
          type="password"
          data-testid="password"
          value={password}
          name="Password"
          label="Password"
          onChange={handlePasswordChange}
        />
        <Button variant="contained" type="submit">
          login
        </Button>
      </FormControl>
    </Box>
  )
}

export default LoginForm
