<template>
  <div class="register-page d-flex align-items-center justify-content-center min-vh-100 bg-light bg-blurred">
    <div class="register-header text-center mb-4">
    </div>

    <div class="register-card card shadow">
      <div class="card-content d-flex">
        <div class="form-side p-4">
          <h2 class="form-title mb-2">Register</h2>
          <div class="form-subtitle mb-4">Input your credentials</div>

          <form @submit.prevent="onRegister">
            <div class="mb-3">
              <label for="name" class="form-label ms-3">Name</label>
              <div class="input-wrapper">
                <input 
                  v-model="name" 
                  type="text" 
                  class="form-control ms-3" 
                  id="name" 
                  placeholder="Enter your name" 
                  required 
                />
              </div>
            </div>

            <div class="mb-3">
              <label for="noreg" class="form-label ms-3">Noreg</label>
              <div class="input-wrapper">
                <input 
                  v-model="noreg" 
                  type="text" 
                  class="form-control ms-3" 
                  id="noreg" 
                  placeholder="Enter your noreg"
                  required 
                />
              </div>
            </div>

            <div class="mb-4">
              <label for="phone" class="form-label ms-3">Phone</label>
              <div class="input-wrapper">
                <input 
                  v-model="phone" 
                  type="tel" 
                  class="form-control ms-3" 
                  id="phone" 
                  placeholder="Enter your phone number"
                  required 
                />
              </div>
            </div>

            <button
              type="submit" 
              class="btn btn-accent w-100 ms-3" 
              :disabled="isLoading"
            >
              <span 
                v-if="isLoading" 
                class="spinner-border spinner-border-sm me-2"
              ></span>
              <span v-else>Register</span>
            </button>
          </form>

          <div class="text-center mt-3 ms-4">
            <span>Already have an account?</span>
            <a 
              href="./#/auth/login/" 
              class="register-link ms-1"
            >Login</a>
          </div> 
        </div>

        <div v-if="showElements" class="image-side">
           <div class="image-wrapper">
            <img 
              :src="loginPhoto" 
              alt="Plant 1" 
              class="login-image" 
            />
           </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mt-3" role="alert">
      <div class="alert-icon">❌</div>
      <span>{{ error }}</span>
    </div>

    <div v-if="success" class="alert alert-success mt-3" role="alert">
      <div class="alert-icon">✓</div>
      <span>{{ success }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import loginPhoto from '@/assets/images/plant_1.jpg';
import api from '@/apis/CommonAPI'
const name = ref('')
const noreg = ref('')
const phone = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref('')
const showElements = ref(true)

const fetchFrontendFlag = async () => {
  try {
    const response = await api.get('/smartandon/frontend')
    const data = response.data
    if (data && Array.isArray(data) && data.length > 0 && data[0].frontend === 1) {
      showElements.value = false
    } else {
      showElements.value = true
    }
  } catch (e) {
    console.error('Error fetching frontend flag:', e)
    showElements.value = true
  }
}

onMounted(() => {
  fetchFrontendFlag()
})

const onRegister = async () => {
  error.value = ''
  success.value = ''

  if (!name.value || !noreg.value || !phone.value) {
    error.value = 'Please fill all fields.'
    return
  }

  isLoading.value = true

  try {
    const response = await api.post('/auth/register', {
      name: name.value,
      noreg: noreg.value,
      phone: phone.value,
    })
    if (response?.status === 201 || response?.status === 200) {
      success.value = 'Registration successful!'
      setTimeout(() => {
        success.value = ''
        window.location.href = '/#/app/dashboard'
      }, 3000)
      name.value = ''
      noreg.value = ''
      phone.value = ''
      setTimeout(() => {
        window.location.href = '/#/auth/login'
      }, 1000)
    } else {
      const errorData = response?.response?.data
      if (errorData && errorData.errors) {
        throw new Error(errorData.errors[0] || 'Registration failed. Please try again.')
      } else if (errorData && errorData.message) {
        throw new Error(errorData.message || 'Registration failed. Please try again.')
      } else {
        throw new Error('Registration failed. Please try again.')
      }
    }
  } catch (e) {
    error.value = e.message || 'Registration failed. Please try again.'
    setTimeout(() => {
      error.value = ''
    }, 3000)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-page {
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.register-card {
  max-width: 1100px;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.register-header {
  max-width: 550px;
  margin: 0 auto 24px;
  text-align: center;
}

.register-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.card-content {
  display: flex;
  padding-right: 35px;
  height: 100%;
}

.form-side {
  flex: 1;
}

.form-title {
  font-size: 26px;
  font-weight: 600;
}

.form-subtitle {
  font-size: 16px;
  font-weight: 400;
}

.form-title,
.form-subtitle {
  text-align: center;
  width: 100%;
  margin-left: 13px;
}

.image-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.image-wrapper {
  width: 100%;
  max-width: 476px;
  height: 320px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.form-label {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.input-wrapper {
  position: relative;
}

.form-control {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px 14px;
  width: 100%;
  box-sizing: border-box;
}

.form-control:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
  outline: none;
  background: #ffffff;
}

.form-control::placeholder {
  color: #a0aec0;
  font-weight: 400;
}

.btn-accent {
  background: linear-gradient(135deg, #dc2626 0%, #a61b1b 100%);
  border: none;
  color: #fff;
  font-weight: 600;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(229, 83, 83, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-accent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-accent:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(229, 83, 83, 0.4);
}

.btn-accent:hover:not(:disabled)::before {
  opacity: 1;
}

.btn-accent:active:not(:disabled) {
  transform: translateY(0);
}

.btn-accent:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-accent span {
  position: relative;
  z-index: 1;
}

.spinner-border {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.alert {
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  border: none;
  backdrop-filter: blur(10px);
}

.alert-danger {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: #f8d7d7;
  color: #dc2626;
  z-index: 9999;
  border: 1px solid #dc2626;
  animation: fadeInOut 3s ease-in-out;
}

.alert-success {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: #ddf8daac;
  color: #16a34a;
  z-index: 9999;
  border: 1px solid #16a34a;
  animation: fadeInOut 3s ease-in-out;
}

.alert-icon {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }

  10%,
  90% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-center {
  justify-content: center;
}

.min-vh-100 {
  min-height: 100vh;
}

.bg-light {
  background-color: #f8f9fa;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.ms-1 {
  margin-left: 0.25rem;
}

.mt-3 {
  margin-top: 1rem;
}

.me-2 {
  margin-right: 0.5rem;
}

.w-100 {
  width: 100%;
}

.p-4 {
  padding: 1.5rem;
}

.card {
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.shadow {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .register-page {
    padding: 16px;
  }

  .register-card {
    margin: 0;
    width: 100%;
    max-width: none;
  }

  .register-header {
    padding: 24px 20px 20px;
    margin: -24px -24px 20px -24px;
  }

  .card-content {
    flex-direction: column;
  }

  .image-side {
    display: none;
  }

  .form-side {
    padding: 32px 24px;
  }

  .form-control {
    padding: 12px 14px;
    margin-left: 0;
  }

  .form-label {
    margin-left: 0;
  }

  .btn-accent {
    padding: 14px 20px;
    margin-left: 0;
  }

  .text-center {
    margin-left: 0;
    text-align: center;
  }
}

* {
  transition: all 0.2s ease;
}

.form-control:focus,
.btn-accent:focus {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}
</style>