import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'

import { Link, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import useAuth from '../hooks/useAuth'

import Button from '../components/Button'
import FormError from '../components/FormError'
import Context from '../modules/Context'
import AuthWrapper, {
  AuthLeftContainer,
  AuthRightContainer
} from '../components/AuthWrapper'

export const Login = (props) => {
  const { message } = props

  const { t } = useTranslation()

  const { login } = useAuth()

  const { register, handleSubmit, errors } = useForm()

  const [showPassword, toggleShowPassword] = useState(false)

  const { state, dispatch } = useContext(Context)

  const onSubmit = async (data) => {
    try {
      const payload = await login({
        identifier: data.identifier,
        password: data.password
      })
      localStorage.setItem('id', payload.user.id)
      localStorage.setItem('username', payload.user.username)
      localStorage.setItem('email', payload.user.email)
      dispatch({
        type: 'AUTHENTICATE'
      })
      navigate('/')
    } catch (e) {}
  }

  return (
    <AuthWrapper>
      <AuthLeftContainer />
      <AuthRightContainer>
        <div>
          {message && <FormError message={message} />}
          {state.errorCode && <FormError status={state.errorCode} />}
          <form className='form-default' onSubmit={handleSubmit(onSubmit)}>
            <div className='header'>{t('authentication:title-sign-in')}</div>
            <div className='form-element'>
              <label htmlFor='identifer'>
                {t('authentication:username-label')}
              </label>
              <input
                className='input-default'
                type='text'
                name='identifier'
                ref={register({ required: true })}
              />
              {errors.identifier && <FormError type={errors.identifier.type} />}
            </div>

            <div className='form-element'>
              <label htmlFor='password'>
                {t('authentication:password-label')}
              </label>
              <input
                className='input-default'
                type={showPassword ? 'text' : 'password'}
                name='password'
                ref={register({ required: true })}
              />
              {errors.password && <FormError type={errors.password.type} />}
            </div>

            <div className='form-element'>
              <div className='flex flex-row flex-space-between'>
                Show password
                <input
                  type='checkbox'
                  name='showPassword'
                  onChange={() => toggleShowPassword(!showPassword)}
                />
              </div>
            </div>
            <Button type='submit' className='btn btn-default'>
              {t('authentication:login-label')}
            </Button>
          </form>
          <div className='flex flex-row flex-space-between'>
            <Link className='link link-default' to='/forgotPassword'>
              {t('authentication:forgot-password')}
            </Link>
            <Link className='link link-default' to='/register'>
              {t('authentication:create-account')}
            </Link>
          </div>
        </div>
      </AuthRightContainer>
    </AuthWrapper>
  )
}

export default Login
