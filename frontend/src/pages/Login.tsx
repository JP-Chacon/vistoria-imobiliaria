import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '../hooks/useAuth'
import { Loader } from '../components/feedback/Loader'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'

type LoginForm = {
  email: string
  password: string
}

export const LoginPage = () => {
  const { login, token, loading } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  if (loading) {
    return <Loader />
  }

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (values: LoginForm) => {
    try {
      setIsSubmitting(true)
      await login(values.email, values.password)
      toast.success('Login realizado com sucesso!')
      navigate('/dashboard', { replace: true })
    } catch (error: any) {
      console.error(error)
      const errorMessage = error?.response?.data?.message || 'Credenciais inválidas.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600">
            Vistoria
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Painel Imobiliário
          </h1>
          <p className="text-sm text-slate-500">
            Acesse o painel usando suas credenciais corporativas.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@empresa.com"
              {...register('email', { required: 'Informe o e-mail' })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Informe a senha' })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}

