import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SignIn from '../../src/components/SignIn.vue'

describe('SignIn.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SignIn)
  })

  afterEach(() => {
    vi.restoreAllMocks() // Restaura todos os mocks após cada teste
  })

  it('renders the component correctly', () => {
    expect(wrapper.find('h1').text()).toBe('Welcome to Todo')
    expect(wrapper.find('button').text()).toBe('Continue with Email')
  })

  it('shows password input only after email is filled and "Continue with Email" is clicked', async () => {
    // Verifica que o input de senha não está visível inicialmente
    expect(wrapper.find('input[type="password"]').exists()).toBe(false)

    // Simula preenchimento do email
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@mail.com')

    // Simula clique no botão "Continue with Email"
    await wrapper.find('button').trigger('click')

    // Verifica que o input de senha agora está visível
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('calls fetchLogin when password is provided and button is clicked', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    )

    // Simula preenchimento do email
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@mail.com')

    // Simula clique no botão "Continue with Email"
    await wrapper.find('button.bg-blue-500').trigger('click')

    // Simula preenchimento da senha
    const passwordInput = wrapper.find('input[type="password"]')
    await passwordInput.setValue('testpassword')

    // Simula clique no botão novamente
    await wrapper.find('button.bg-blue-500').trigger('click')

    // Verifica se fetch foi chamado
    expect(globalThis.fetch).toHaveBeenCalled()
    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5248/api/Auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@mail.com',
        password: 'testpassword',
      }),
    })
  })

  it('displays an error if fetchLogin fails', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {})
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('Failed to fetch')))

    // Simula preenchimento do email
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@mail.com')

    // Simula clique no botão "Continue with Email"
    await wrapper.find('button.bg-blue-500').trigger('click')

    // Simula preenchimento da senha
    const passwordInput = wrapper.find('input[type="password"]')
    await passwordInput.setValue('testpassword')

    // Simula clique no botão novamente
    await wrapper.find('button.bg-blue-500').trigger('click')

    // Verifica se o erro foi registrado no console
    expect(consoleErrorMock).toHaveBeenCalledWith(new Error('Failed to fetch'))
    consoleErrorMock.mockRestore() // Restaura o console.error original
  })

  it('displays an error message for invalid email or password', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({}),
      }),
    )

    // Simula preenchimento do email
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('invalid@mail.com')

    // Simula clique no botão "Continue with Email"
    await wrapper.find('button.bg-blue-500').trigger('click')

    // Simula preenchimento da senha
    const passwordInput = wrapper.find('input[type="password"]')
    await passwordInput.setValue('wrongpassword')

    // Simula clique no botão novamente
    await wrapper.find('button.bg-blue-500').trigger('click')

    // Verifica se a mensagem de erro é exibida
    expect(wrapper.find('.text-red-500').text()).toBe('Email not found or incorrect password.')
  })

  it('does not call fetchLogin when email is empty', async () => {
    await wrapper.find('button.bg-blue-500').trigger('click')
    expect(globalThis.fetch).not.toHaveBeenCalled()
    expect(wrapper.find('.text-red-500').text()).toContain('Email is required')
  })

  it('show error for invalid email format', async () => {
    await wrapper.find('input[type="email"]').setValue('invalid-email')
    await wrapper.find('button.bg-blue-500').trigger('click')
    expect(wrapper.find('.text-red-500').text()).toContain('Invalid email format')
  })
})
