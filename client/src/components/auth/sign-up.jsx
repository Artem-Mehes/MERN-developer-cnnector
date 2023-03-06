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

import { registerUser } from 'store/auth';

const SignUp = () => {
  const dispatch = useDispatch();

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ password, email, name }) => {
    await dispatch(registerUser({ password, email, name }));
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ pt: 8, display: 'flex', flexDirection: 'column', gap: 4 }}
    >
      <div>
        <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
          Sign Up
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Person />
          <Typography variant="h6">Create your account</Typography>
        </Box>
      </div>

      <Box
        noValidate
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}
      >
        <TextField
          {...register('name', { required: 'Name is required' })}
          label="Name"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />

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
            minLength: {
              value: 6,
              message: 'Please enter a password with 6 or more characters',
            },
          })}
        />
        <TextField
          required
          type="password"
          label="Confirm password"
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Confirm password is required',
            validate: (value) =>
              watch('password') !== value
                ? 'Your passwords do not match'
                : null,
          })}
        />

        <Button size="large" type="submit" variant="contained">
          Sign up
        </Button>
      </Box>

      <Typography sx={{ display: 'flex', gap: 1 }}>
        Already have an account?
        <Link component={RouterLink} to="/sign-in">
          Sign in
        </Link>
      </Typography>
    </Container>
  );
};

export { SignUp };
