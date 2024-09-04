<template>
    <div class="min-h-screen bg-gradient-to-br from-red-500 to-white flex flex-col justify-center items-center p-6">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-8 space-y-6">
        <h1 class="text-2xl font-semibold font-noto-sans-lao text-center text-red-600">ເຂົ້າສູ່ລະບົບ</h1>
  
        <form @submit.prevent="sendLogin" class="space-y-4">
          <div class="relative">
            <input type="email" v-model="loginData.username" placeholder="ອີເມວ"
              class="w-full font-noto-sans-lao p-3 border border-red-300 rounded-lg focus:border-red-500 focus:outline-none pl-10">
            <MailIcon class="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          </div>
  
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="loginData.password" placeholder="ລະຫັດຜ່ານ"
              class="w-full p-3 border font-noto-sans-lao border-red-300 rounded-lg focus:border-red-500 focus:outline-none pl-10 pr-12">
            <LockIcon class="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <button type="button" @click="togglePassword" class="absolute right-3 top-3">
              <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-500" />
              <EyeOffIcon v-else class="h-5 w-5 text-gray-500" />
            </button>
          </div>
  
          <button type="submit"
            :disabled="isButtonDisabled"
            class="w-full font-noto-sans-lao py-3 font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
           ເຂົ້າສູ່ລະບົບ
          </button>
        </form>
  
        <div class="text-center">
          <p class="text-sm font-noto-sans-lao text-gray-600 mb-4">ສະໝັກຜ່ານມິເດຍ</p>
          <div class="flex justify-center space-x-4">
            <button class="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-200">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png"
                alt="Facebook" class="w-6 h-6" />
            </button>
            <button @click="signGoogle"
              class="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-200">
              <img src="https://w7.pngwing.com/pngs/63/1016/png-transparent-google-logo-google-logo-g-suite-chrome-text-logo-chrome.png"
                alt="Google" class="w-6 h-6" />
            </button>
            <button class="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-200">
              <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" class="w-6 h-6" />
            </button>
          </div>
        </div>
  
        <p class="text-sm font-noto-sans-lao text-center">
          ບັນຊີມີແລ້ວບໍ? 
          <a href="#" @click.prevent="goToLogin" class="text-red-600 font-noto-sans-lao hover:underline">ລົງທະບຽນ</a>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from 'lucide-vue-next';
  import { useRouter } from 'vue-router';
  import loginService from '@/services/login.service';
  
  const router = useRouter();
  const showPassword = ref(false);
  const loginData = ref({
    username: '',
    password: ''
  });
  const stayLoggedIn = ref(false);
  
  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };
  
  const sendLogin = async () => {
    try {
      const response = await loginService.login(loginData.value.username, loginData.value.password);
      const data = response.data;
  
      if (response.status === 200 && data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
  
        if (stayLoggedIn.value) {
          localStorage.setItem('username', loginData.value.username);
          localStorage.setItem('password', loginData.value.password);
        } else {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
  
        router.push('/main');
      } else {
        console.error('Login failed: ', response.statusText);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  const isButtonDisabled = computed(() => {
    return loginData.value.username.trim() === '' || loginData.value.password.trim() === '';
  });
  
  const signGoogle = async () => {
    try {
      const response = await loginService.signInWithGoogle();
      console.log(response);
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
    }
  };
  
  const goToLogin = () => {
    router.push('/register');
  };
  </script>
  