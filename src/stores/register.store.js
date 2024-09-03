// stores/useRegisterStore.js
import { defineStore } from "pinia";

export const useRegisterStore = defineStore("register", {
  state: () => ({
    selectedType: null,
    name: "",
    phoneNumber: "",
  }),
  actions: {
    setSelectedType(type) {
      this.selectedType = type;
    },
    updateUserInfo({ name, phoneNumber }) {
        this.name = name;
        this.phoneNumber = phoneNumber;
    }
  },
});
