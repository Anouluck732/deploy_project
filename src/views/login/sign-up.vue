<template>
  <div class="min-h-screen bg-gradient-to-br from-white to-red-500 flex flex-col justify-center items-center p-4">
    <!-- <div class="m-8">
      <img src="../../assets/images/Easyshop.PNG" alt="Easyshop Logo" class="w-36 h-36">
    </div> -->
    <div class="bg-white rounded-t-3xl w-full max-w-md p-8 space-y-6">
      <h1 class="text-2xl font-bold text-center font-noto-sans-lao text-red-600">ສ້າງບັນຊີຂອງເຈົ້າ</h1>

      <form @submit.prevent="handleSignUp" class="space-y-4">
        <div class="relative">
          <input v-model="fullName" type="text" placeholder="ຊື່ ແລະ ນາມສະກຸນ"
            class="w-full font-noto-sans-lao p-3 border border-red-300 rounded-lg focus:border-red-500 focus:outline-none pl-10">
          <UserIcon class="absolute left-3 top-3 h-5 w-5 text-gray-500" />
        </div>

        <div class="relative">
          <input v-model="email" type="email" placeholder="ອີເມວ"
            class="w-full font-noto-sans-lao p-3 border border-red-300 rounded-lg focus:border-red-500 focus:outline-none pl-10">
          <MailIcon class="absolute left-3 top-3 h-5 w-5 text-gray-500" />
        </div>

        <div class="relative">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="ລະຫັດຜ່ານ"
            class="w-full p-3 font-noto-sans-lao border border-red-300 rounded-lg focus:border-red-500 focus:outline-none pl-10 pr-12">
          <LockIcon class="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <button type="button" @click="togglePassword" class="absolute right-3 top-3">
            <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-500" />
            <EyeOffIcon v-else class="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div class="relative">
          <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="ຢືນຢັນລະຫັດຜ່ານ"
            class="w-full font-noto-sans-lao p-3 border border-red-300 rounded-lg focus:border-red-500 focus:outline-none pl-10 pr-12">
          <LockIcon class="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <button type="button" @click="toggleConfirmPassword" class="absolute right-3 top-3">
            <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5 text-gray-500" />
            <EyeOffIcon v-else class="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <button type="submit"
          class="w-full py-2 px-4 font-noto-sans-lao bg-red-600 rounded-full text-white hover:bg-red-700 transition duration-200">
          ລົງທະບຽນ
        </button>
      </form>

      <div class="text-center">
        <p class="text-sm font-noto-sans-lao text-gray-600 mb-4">ລົງທະບຽນຜ່ານໂຊຊ້ຽວມິເດຍ</p>
        <div class="flex justify-center space-x-4">
          <button class="p-2 border rounded-full hover:bg-gray-100 transition duration-200">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png"
              alt="Facebook" class="w-6 h-6" />
          </button>
          <button @click="signGoogle" class="p-2 border rounded-full hover:bg-gray-100 transition duration-200">
            <img
              src="https://w7.pngwing.com/pngs/63/1016/png-transparent-google-logo-google-logo-g-suite-chrome-text-logo-chrome.png"
              alt="Google" class="w-6 h-6" />
          </button>
          <button class="p-2 border rounded-full hover:bg-gray-100 transition duration-200">
            <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <p class="text-sm text-center font-noto-sans-lao">
        ເຈົ້າບັນຊີຢູ່ແລ້ວແມ່ນບໍ?
        <a href="#" @click.prevent="goToLogin" class="text-red-600 font-noto-sans-lao hover:underline">ເຂົ້າສູ່ລະບົບ</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EyeIcon, EyeOffIcon, UserIcon, MailIcon, LockIcon } from 'lucide-vue-next';
import loginService from '@/services/login.service';
import router from '@/router';

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleSignUp = async () => {
  try {
    const body = {
      fullname: fullName.value,
      email: email.value,
      password: password.value,
    }
    if (password.value !== confirmPassword.value) {
      alert('password not match')
      return;
    }
    const reponse = await loginService.register(body)
    console.log(reponse)
    router.push('/login')
  } catch (error) {
    console.error('Failed to sign up:', error);
  }
}

const signGoogle = async () => {
  try {
    const response = await loginService.signInWithGoogle();
    console.log(response)
  } catch (error) {
    console.error('Failed to sign in with Google:', error);
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const goToLogin = () => {
  router.push('/login')
}
</script>
