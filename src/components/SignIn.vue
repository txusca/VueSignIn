<template>
  <div
    class="container max-w-md pt-2 flex items-center justify-center flex-col p-4 shadow-md mx-auto gap-4 text-center">
    <div class="w-full flex items-start">
      <div class="bg-gray-200 p-4 rounded-full">
        <DoorOpen :size="60" class="text-gray-400" />
      </div>
    </div>
    <h1 class="text-3xl font-semibold">Welcome to Todo</h1>
    <p>Please sign in or sign up below.</p>
    <div class="flex flex-col gap-2 w-full">
      <label for="email" class="text-left">Email</label>
      <input v-model="email" placeholder="you@mail.com" type="email" name="email" id="email"
        class="border p-2 rounded placeholder:pl-2" />
      <label v-if="emailChosen" for="password" class="text-left">Password</label>
      <input v-if="emailChosen" v-model="password" placeholder="Password" type="password" name="password" id="password"
        class="border p-2 rounded placeholder:pl-2" />
      <button @click.prevent="handleEmail" class="bg-blue-500 text-white p-2 rounded">
        Continue with Email
      </button>
      <hr v-if="!emailChosen" class="my-2" />
      <button v-if="!emailChosen" class="bg-red-500 text-white p-2 rounded">
        Sign in with Google
      </button>
      <div v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { DoorOpen } from 'lucide-vue-next'
import { ref } from 'vue'

const email = ref(null)
const password = ref(null)
const errorMessage = ref(null)
const emailChosen = ref(false)

const handleEmail = async () => {
  if (!email.value) {
    errorMessage.value = 'Email is required'
    return
  }
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Invalid email format'
    return
  }
  emailChosen.value = true
  errorMessage.value = null
  if (password.value && email.value) {
    await fetchLogin()
  }
}

const fetchLogin = async () => {
  try {
    const response = await fetch(`http://localhost:5248/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        errorMessage.value = 'Email not found or incorrect password.'
      } else {
        errorMessage.value = 'An unexpected error occurred.'
      }
      return
    }

    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Failed to connect to the server.'
  }
}
</script>
