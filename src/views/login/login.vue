<template>
    <div class="min-h-screen bg-white flex flex-col">
        <div class="fixed top-0 left-0 w-full bg-white z-10 flex items-center justify-between p-4">
            <button class="text-2xl">
                <ChevronLeft class="h-6 w-6 text-gray-600" />
            </button>
            <h1 class="text-header">로그인</h1>
            <div class=""></div> <!-- Spacer to balance the layout -->
        </div>
        <hr class="mt-16" />

        <div class="flex-grow flex flex-col items-center justify-center p-4">
            <img src="@/assets/images/blue-arena.png" alt="Blue Arena Park Logo" class="w-32 mb-6" />
            <p class="text-header">
                사차 구매고객 맞춤형 원스톱 서비스
            </p>
            <p class="text-header">
                품을 아레나 파크에서 오신 것을 환영합니다.
            </p>

            <div class="w-full max-w-sm mb-6">
                <div class="flex border-b border-gray-200">
                    <button @click.prevent="activeTab = 'carMaster'"
                        :class="['flex-1 py-2 text-center', activeTab === 'carMaster' ? 'text-[#002C5F] border-b-4 border-[#002C5F] font-hyundai font-medium' : 'text-gray-500']">
                        카마스터 회원
                    </button>
                    <button @click.prevent="activeTab = 'individual'"
                        :class="['flex-1 py-2 text-center', activeTab === 'individual' ? 'text-[#002C5F] border-b-4 border-[#002C5F] font-hyundai font-medium' : 'text-gray-500']">
                        개인회원
                    </button>
                </div>
            </div>

            <form @submit.prevent="sendLogin" class="w-full max-w-sm">
                <div class="mb-4">
                    <label for="username" class="text-title">아이디</label>
                    <input v-model="loginData.username" type="text" id="username" placeholder="아이디를 입력해주세요."
                        class="w-full p-2 border border-gray-300 rounded" />
                </div>

                <div class="mb-6 relative">
                    <label for="password" class="text-title">비밀번호</label>
                    <input v-model="loginData.password" :type="showPassword ? 'text' : 'password'" id="password"
                        placeholder="비밀번호를 입력해주세요." class="input-text" />
                    <button type="button" @click.prevent="togglePassword"
                        class="absolute inset-y-0 right-0 top-6 pr-3 flex items-center">
                        <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                        <EyeOff v-else class="h-5 w-5 text-gray-400" />
                    </button>
                </div>
                <div v-if="loginError" class="text-red-500 text-sm mb-4">
                    잘못된 사용자 이름 또는 비밀번호
                </div>
                <div class="flex items-center mb-6">
                    <input type="checkbox" id="stayLoggedIn" v-model="stayLoggedIn" class="custom-checkbox">
                    <label for="stayLoggedIn" class="ml-2 block text-sm text-gray-900">
                        자동 로그인
                    </label>
                </div>

                <div class="flex justify-between text-sm text-gray-600 mb-6">
                    <div>
                        <label @click="router.push('/find-id')" class="text-title">아이디 찾기 <span>|</span> </label>
                        <label @click="router.push('/find-password')" class="text-title">비밀번호 찾기</label>
                    </div>

                    <label @click="router.push('/register/register-type')"
                        class="text-title cursor-pointer">회원가입</label>
                </div>

                <button type="submit" :class="[
                    'w-full py-2 rounded',
                    isButtonDisabled ? 'bg-[#DDDDDD] text-black cursor-not-allowed' : 'btn-login'
                ]" :disabled="isButtonDisabled">
                    로그인
                </button>
            </form>
        </div>
    </div>
    <modal :show="showModal" @close="onClose" :title="modalTitle" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft, Eye, EyeOff } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import loginService from '@/services/login.service';
const loginError = ref(false)
const router = useRouter()
const showPassword = ref(false)
const activeTab = ref('individual')
const showModal = ref(false)
const modalTitle = ref('아이디, 비밀번호를 확인하세요.')

const onClose = () => {
    showModal.value = false
}

const loginData = ref({
    username: '',
    password: ''
})
const stayLoggedIn = ref(false)

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

onMounted(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername && storedPassword) {
        loginData.value.username = storedUsername;
        loginData.value.password = storedPassword;
        stayLoggedIn.value = true;
    }
});

const sendLogin = async () => {
    try {
        const response = await loginService.login(loginData.value.username, loginData.value.password);
        const data = response.data; // Extract the response data

        if (response.status === 200 && data.token) { // Check for success and token presence
            loginError.value = false;

            // Store the token in localStorage
            localStorage.setItem('token', data.token);

            // Optionally, store user details if needed
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
            loginError.value = true;  // Show error message
            showModal.value = true;
        }
    } catch (error) {
        console.error('Login failed:', error);
        loginError.value = true;
        showModal.value = true;
    }
};



const isButtonDisabled = computed(() => {
    return loginData.value.username.trim() === '' || loginData.value.password.trim() === ''
})

</script>
