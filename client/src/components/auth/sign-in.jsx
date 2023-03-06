import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Person from '@mui/icons-material/Person';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Link,
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
} from '@mui/material';

import { signIn } from 'store/auth';

const SignIn = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    await dispatch(signIn({ password, email }));
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ pt: 8, display: 'flex', flexDirection: 'column', gap: 4 }}
    >
      <div>
        <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
          Sign in
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Person />
          <Typography variant="h6">Sign into your account</Typography>
        </Box>
      </div>

      <Box
        noValidate
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}
      >
        <FormControl variant="standard">
          <TextField
            required
            label="Email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Email should be valid',
              },
            })}
          />
          <FormHelperText>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </FormHelperText>
        </FormControl>

        <TextField
          required
          type="password"
          label="Password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
          })}
        />
        <Button size="large" type="submit" variant="contained">
          Sign in
        </Button>

        <Typography sx={{ display: 'flex', gap: 1 }}>
          Don't have an account?
          <Link component={RouterLink} to="/sign-up">
            Sign up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export { SignIn };
