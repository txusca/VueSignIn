<template>
  <div class="text-4xl">Bem vindo ao Todo, Faça o Login para continuar.</div>
  <div class="">
    <SignIn class="mb-10" />
    <SignUp />
  </div>
</template>

<script setup>
import SignIn from './components/SignIn.vue';
import SignUp from './components/SignUp.vue';
</script>
