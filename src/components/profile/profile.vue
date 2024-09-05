<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 font-noto-sans-lao">ຂໍ້ມູນຜູ້ໃຊ້</h1>

    <div class="flex items-center mb-6">
      <img
        src="https://static.vecteezy.com/system/resources/previews/019/900/322/non_2x/happy-young-cute-illustration-face-profile-png.png"
        alt="Profile" class="w-16 h-16 rounded-full mr-4" />
      <div>
        <h2 class="text-xl font-semibold font-noto-sans-lao">{{ profile.name }}</h2>
        <p class="text-gray-500 font-noto-sans-lao">{{ profile.email }}</p>
      </div>
    </div>

    <div v-for="(item, index) in profileItems" :key="index"
      class="flex items-center justify-between py-4 border-b border-gray-200 cursor-pointer"
      @click="item.title === 'ອອກຈາກລະບົບ' ? handleLogout() : handleItemClick(item.title)">
      <div>
        <h3 class="text-base font-semibold font-noto-sans-lao">{{ item.title }}</h3>
        <p class="text-sm text-gray-500 font-noto-sans-lao">{{ item.subtitle }}</p>
      </div>
      <svg v-if="item.title !== 'ອອກຈາກລະບົບ'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400"
        viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd" />
      </svg>
      <LucideLogOut v-if="item.title === 'ອອກຈາກລະບົບ'" class="h-5 w-5 text-gray-400" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut as LucideLogOut } from 'lucide-vue-next'

const router = useRouter()

const profile = ref({
  name: '',
  email: '',
})

// Fetch profile from local storage when component is mounted
onMounted(() => {
  const storedProfile = JSON.parse(localStorage.getItem('user'))
  if (storedProfile) {
    profile.value = {
      name: storedProfile.name || '',
      email: storedProfile.email || ''
    }
  }
})

const profileItems = ref([
  { title: 'ລາຍການສັ່ງຊື້ທີ່ສຳເລັດ', subtitle: 'ໄດ້ສັ່ງຊື້ 12 ລາຍການ' },
  { title: 'ທີ່ຢູ່ສົ່ງ', subtitle: '3 ທີ່ຢູ່' },
  { title: 'ປ່ຽນລະຫັດຜ່ານ', subtitle: '' },
  { title: 'ພາສາ', subtitle: '' },
  { title: 'ລາຍການລີວິວຂອງຂ້ອຍ', subtitle: 'ລີວິວ 4 ລາຍການ' },
  { title: 'ອອກຈາກລະບົບ', subtitle: '' }  // Added Logout item in Lao
])

const handleItemClick = (item) => {
  console.log(`Clicked item: ${item}`) // Add this for debugging
  if (item === 'ລາຍການສັ່ງຊື້ທີ່ສຳເລັດ') {
    router.push('/complete-order')
  } 
  else if (item === 'ປ່ຽນລະຫັດຜ່ານ') {
    console.log('Navigating to reset password') // Debug log
    router.push('/reset-password')
  } 
  else {
    console.log(`Clicked on ${item}`)
  }
}





const handleLogout = () => {
  // Remove token and user from local storage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  // Redirect to login page
  router.push('/login')
}
</script>

<style scoped>
.font-noto-sans-lao {
  font-family: 'Noto Sans Lao', sans-serif;
}
</style>
