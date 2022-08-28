
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { message } from 'antd';
import axios from "axios"
import { useNavigate } from 'react-router';


export default function SignIn() {
  const theme = createTheme();

  const navigate = useNavigate()
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios.post('/api/login',{
      username: data.get('username'),
      password: data.get('password'),
    }).then((res) => {  
      if(res.data.status === 0) {
        navigate("/", {replace: true, state: res.data})
        window.localStorage.setItem("username",res.data.data.username)
        window.localStorage.setItem("_id",res.data.data._id)
        window.localStorage.setItem("role",res.data.data.role)        
        window.localStorage.setItem("token",res.data.data.token)        
      } else {
        message.error(res.data.data);
      }
    }).catch((err) => {
      console.log(err)
    })    
    
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>            
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}