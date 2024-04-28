const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input type="text" data-testid="username" value={username} name="Username" onChange={handleUsernameChange} />
      </div>
      <div>
        password
        <input
          type="password"
          data-testid="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
