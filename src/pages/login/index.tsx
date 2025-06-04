import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { useLoginMutate } from '@/hooks/use-user'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import AuthWrapper from '@/components/auth-wrapper'

function Login() {
  const [showPass, setShowPass] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { isPending, mutate } = useLoginMutate()

  const onSubmit = (data: any) => {
    mutate({ ...data, email: data.email?.toLowerCase()?.trim() })
  }

  return (
    <AuthWrapper title='Welcome back' description='Enter your credentials'>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='email' className='block text-sm font-medium mb-1'>
            Email
          </label>
          <Input type='email' id='email' placeholder='Enter your email' {...register('email', { required: true })} />
          {errors.email && <p className='text-red-500 text-sm mt-1'>Email is required</p>}
        </div>

        <div>
          <label htmlFor='password' className='block text-sm font-medium mb-1'>
            Password
          </label>
          <div className='relative'>
            <Input
              type={showPass ? 'text' : 'password'}
              id='password'
              placeholder='Enter your password'
              {...register('password', { required: true })}
            />
            <button
              type='button'
              onClick={() => setShowPass((prev) => !prev)}
              className='absolute right-2 top-2.5 text-muted-foreground hover:text-foreground transition'>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className='text-red-500 text-sm mt-1'>Password is required</p>}
        </div>

        <div className='text-right'>
          <Link to='/forgot-pass' className='text-sm text-muted-foreground hover:underline'>
            Forgot password?
          </Link>
        </div>

        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className='text-center text-xs text-muted-foreground !mb-4 '>
          Have a Nidum AI account? Use your credentials to sign in.
        </div>

        <div className='text-center text-sm text-muted-foreground mt-6'>
          Don&apos;t have an account? {'  '}
          <Link to='/signup' className='text-primary hover:underline'>
            Register
          </Link>
        </div>
      </form>
    </AuthWrapper>
  )
}

export default Login
