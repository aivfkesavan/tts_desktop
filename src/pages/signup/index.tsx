import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { useSignupMutate } from '@/hooks/use-user'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import AuthWrapper from '@/components/auth-wrapper'

type dataType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string
}

function Signup() {
  const [showPass, setShowPass] = useState(false)

  const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm<dataType>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const { isPending, mutate } = useSignupMutate()

  const updateShowPass = () => setShowPass((p) => !p)

  function onSubmit(data: dataType) {
    mutate({ ...data, email: data.email?.toLowerCase()?.trim() })
  }

  return (
    <AuthWrapper
      title='Create an account'
      description='Enter your details to get started'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label className='text-sm font-medium' htmlFor='firstName'>
            First Name
          </label>
          <Input
            id='firstName'
            type='text'
            placeholder='Enter your first name'
            {...register('firstName', {
              required: 'First Name is required',
            })}
          />
          {errors.firstName && <div className='mt-0.5 text-xs text-red-600'>{errors.firstName.message}</div>}
        </div>

        <div>
          <label className='text-sm font-medium' htmlFor='lastName'>
            Last Name
          </label>
          <Input
            id='lastName'
            type='text'
            placeholder='Enter your last name'
            {...register('lastName')}
          />
          {errors.lastName && <div className='mt-0.5 text-xs text-red-600'>{errors.lastName.message}</div>}
        </div>

        <div>
          <label className='text-sm font-medium' htmlFor='email'>
            Email
          </label>
          <Input
            id='email'
            type='email'
            placeholder='Enter your email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Enter a valid email',
              },
            })}
          />
          {errors.email && <div className='mt-0.5 text-xs text-red-600'>{errors.email.message}</div>}
        </div>

        <div>
          <label className='text-sm font-medium' htmlFor='password'>
            Password
          </label>
          <div className='relative'>
            <Input
              id='password'
              type={showPass ? 'text' : 'password'}
              placeholder='Enter your password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
            />
            <button
              onClick={updateShowPass}
              type='button'
              className='absolute top-2.5 right-2 opacity-60 hover:opacity-80 cursor-pointer'>
              {showPass ? <Eye className='size-4' /> : <EyeOff className='size-4' />}
            </button>
          </div>
          {errors.password && <div className='mt-0.5 text-xs text-red-400'>{errors.password.message}</div>}
        </div>

        <Button
          type='submit'
          className='w-full bg-primary hover:bg-primary/90'
          disabled={isPending || isSubmitting}>
          Register
        </Button>

        <p className='text-center text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link to='/login' className='text-primary hover:underline'>
            Login
          </Link>
        </p>
      </form>
    </AuthWrapper>
  )
}

export default Signup
