<template>
    <div class="min-h-screen bg-gradient-to-br from-red-500 to-red-600 flex flex-col justify-center items-center p-4">
      <div class="bg-white rounded-t-3xl w-full max-w-md p-8 space-y-8">
        <h1 class="text-3xl font-bold text-center text-red-600">WELCOME BACK</h1>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <button type="submit" class="w-full py-2 px-4 border border-red-600 rounded-full text-red-600 hover:bg-red-50 transition duration-200">
            LOGIN
          </button>
          
          <button type="button" @click="handleSignUp" class="w-full py-2 px-4 bg-red-600 rounded-full text-white hover:bg-red-700 transition duration-200">
            SIGN UP
          </button>
        </form>
        
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-4">Sign with Social Media</p>
          <div class="flex justify-center space-x-4">
            <button class="p-2 border rounded-full hover:bg-gray-100 transition duration-200">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png" alt="Facebook" class="w-6 h-6"/>
            </button>
            <button class="p-2 border rounded-full hover:bg-gray-100 transition duration-200">
              <img src="https://w7.pngwing.com/pngs/63/1016/png-transparent-google-logo-google-logo-g-suite-chrome-text-logo-chrome.png" alt="Google" class="w-6 h-6"/>
            </button>
            <button class="p-2 border rounded-full hover:bg-gray-100 transition duration-200">
              <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" class="w-6 h-6"/>
            </button>
          </div>
        </div>
        
        <p class="text-sm text-center">
          Don't have an account?
          <a href="#" @click.prevent="handleSignUp" class="text-red-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
import router from '@/router';

  const handleLogin = () => {
    // Implement login logic here
    router.push('/login')
  }
  
  const handleSignUp = () => {
    // Implement sign up logic here
    router.push('/register')

  }
  </script>