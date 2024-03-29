<template>
     <div class="container max-w-full mx-auto py-24 px-4">
          <div class="max-w-sm mx-auto">
               <div class="flex flex-wrap">
                    <div class="w-full">
                         <div class="text-center font-semibold text-black">
                              <h2 class="text-center text-3xl font-extrabold text-gray-900">Forgot the password?</h2>
                              <p>Send reset password link to your email</p>
                         </div>
                         <form class="mt-8" @submit.prevent="handleSubmit" novalidate>
                              <Alert v-if="showAlert" />
                              <div class="mx-auto max-w-lg">
                                   <input-wrapper label="Email">
                                        <input-field
                                             class="w-full"
                                             type="email"
                                             v-model="data.email"
                                             @blur="v$.email.$touch()"
                                             placeholder="Your email address"
                                        />
                                        <input-errors v-for="error of v$.email.$errors" :error="error" :key="error.$uid" />
                                   </input-wrapper>

                                   <button
                                        class="mt-3 text-lg font-semibold bg-indigo-700 w-full text-white rounded-lg px-6 py-2 block shadow-xl hover:text-white hover:bg-indigo-900"
                                   >
                                        Login
                                   </button>
                                   <div class="flex justify-end">
                                        <label class="block text-gray-500 font-bold my-4">
                                             <router-link
                                                  to="/login"
                                                  class="cursor-pointer tracking-tighter text-black border-b-2 border-gray-200 hover:border-gray-600"
                                             >
                                                  <span>Back to login</span>
                                             </router-link>
                                        </label>
                                   </div>
                              </div>
                         </form>
                    </div>
               </div>
          </div>
     </div>
     <Loader v-if="loading" />
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import forgotPasswordValidation from '@/validations/forgotPasswordValidation';
import { InputWrapper, InputField, InputErrors, Loader, Alert } from '@/components';

export default {
     name: 'ForgotPassword',
     components: { InputWrapper, InputField, InputErrors, Alert, Loader },
     setup() {
          const showAlert = computed(() => store.state.alert.show);
          const loading = ref(false);
          const store = useStore();
          const data = ref({
               email: '',
          });

          const v$ = useVuelidate(forgotPasswordValidation, data.value);

          const handleSubmit = async () => {
               const formIsValid = await v$.value.$validate();

               if (formIsValid) {
                    loading.value = true;
                    await store.dispatch('hideAlert');

                    try {
                         await axios.post('/auth/reset-password/', data.value).then(() => {
                              router.push({ name: 'Login' });
                         });
                    } catch (err) {
                         await store.dispatch('showAlert', err.response.data.message);
                    }
                    loading.value = false;
               }
          };

          return {
               handleSubmit,
               showAlert,
               loading,
               data,
               v$,
          };
     },
};
</script>
