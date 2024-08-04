import { Typography, List, ListItem, ListItemIcon, ListItemText, Icon, Box } from '@mui/material'

const User = ({ user }) => {
  return (
    <Box mt={4}>
      <Typography variant="h2" gutterBottom>
        {user.name}
      </Typography>
      <Typography variant="h4" component="h3" gutterBottom>
        Added blogs
      </Typography>
      <List>
        {user.blogs.map(blog => (
          <ListItem key={blog.id}>
            <ListItemIcon>
              <Icon>web</Icon>
            </ListItemIcon>
            <ListItemText primary={blog.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default User
