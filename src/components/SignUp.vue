<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div class="bg-white p-6 rounded shadow-md w-96">
        <h2 class="text-2xl font-bold mb-4">Sign Up</h2>
        <form @submit.prevent="handleEmail">
          <div class="mb-4">
            <label for="fullName" class="block text-sm font-medium text-gray-700">Fullname</label>
            <input type="text" id="fullName" v-model="fullName" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500" />
          </div>
          <div class="mb-4">
            <label for="userName" class="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="userName" v-model="userName" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500" />
          </div>
          <div class="mb-4">
            <label for="emailSignup" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="emailSignup" v-model="email" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500" />
          </div>
          <div class="mb-4">
            <label for="passwordSignup" class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="passwordSignup" v-model="password" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500" />
          </div>
          <button @click.prevent="handleSubmit" type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200">
            Sign Up
          </button>
        </form>
        <ul v-for="(error, index) in errorMessage" :key="index" class="mt-4">
          <li class="text-red-500 text-sm .error-message">
            {{ error.description }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fullName = ref(null)
const userName = ref(null)
const email = ref(null)
const password = ref(null)
const errorMessage = ref(null)

const validatePassword = () => {
  errorMessage.value = []
  const passwordRules = [
    {
      regex: /.{6,}/,
      description: 'Passwords must be at least 6 characters.',
    },
    {
      regex: /[A-Z]/,
      description: 'Passwords must contain at least one uppercase letter.',
    },
    {
      regex: /[a-z]/,
      description: 'Passwords must contain at least one lowercase letter.',
    },
    {
      regex: /[0-9]/,
      description: 'Passwords must contain at least one number.',
    },
    {
      regex: /[@$!%*?&#]/,
      description: 'Passwords must contain at least one special character (@, $, !, %, *, ?, &, #).',
    },
  ]

  passwordRules.forEach((rule) => {
    if (!rule.regex.test(password.value)) {
      errorMessage.value.push({ description: rule.description })
    }
  })

  return errorMessage.value.length === 0
}

const handleSubmit = async () => {
  if (!validatePassword()) return
  try {
    const response = await fetch('http://localhost:5248/api/Auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fullName.value,
        userName: userName.value,
        email: email.value,
        password: password.value,
      }),
    })
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('Error during sign up:', error)
  }
}
</script>
