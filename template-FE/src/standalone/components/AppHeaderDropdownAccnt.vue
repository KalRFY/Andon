<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" href="javascript:void(0);">
      {{ userName }}&ensp;
      <img v-if="photo" :src="photo" class="rounded-circle" style="width: 36px; height: 36px;" />
      <CAvatar v-else color="danger" text-color="white">{{ initials }}
      </CAvatar>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0 mt-2">
      <CDropdownHeader component="h6" class="fw-semibold py-2 mt-2 mb-2">
        Account
      </CDropdownHeader>
      <CDropdownItem href="/#/sc/profile">
        <CIcon icon="cil-user" /> Profile
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem href="#" @click="logout()">
        <CIcon icon="cilAccountLogout" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import avatar from '@/standalone/assets/images/avatars/8.jpg'
import api from "@/apis/CommonAPI"
import { ref, onMounted, computed } from 'vue'

export default {
  name: 'AppHeaderDropdownAccnt',
  setup() {
    const photo = ref(null)
    const userName = ref('User Name 1')

    onMounted(async () => {
      try {
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        const response = await api.get('/user/user')
        console.log("User data:", response)
        if (response.status !== 200) throw new Error('Failed to fetch user')
        const data = response.data
        userName.value = data.user.name || userName.value
        photo.value = data.user.photo || null
      } catch (e) {
        console.error('Error fetching user:', e)
      }
    })

    const initials = computed(() => {
      const name = (userName.value || '').trim()
      return name ? name.charAt(0).toUpperCase() : ''
    })

    const logout = () => {
      localStorage.removeItem('token')
      window.location.href = "/#/auth/login"
    }

    return {
      photo,
      userName,
      initials,
      logout
    }
  }
}
</script>

<style>
.avatar-avatar,
.CAvatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e55353;
  font-weight: bold;
}
</style>
