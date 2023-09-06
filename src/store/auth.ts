import { defineStore } from "pinia";
import { showUsers } from "@/services/api/userApi";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    opensSign: false,
    opensRegister: false,
    defaultPath: "",
    users: {} as {
      id: number | string;
      username: string;
      name: string;
      surname: string;
      dateOfBirth: any;
      img: { name: string };
      country: string;
      age: string | number;
      adress: string;
      city: string;
    },
  }),
  actions: {
    openSign() {
      this.opensSign = true;
    },
    openRegistr() {
      this.opensRegister = true;
    },
    close() {
      this.opensSign = false;
      this.opensRegister = false;
    },
    showUser() {
      const jwtToken = localStorage.getItem("isAuthenticated");
      console.log(jwtToken);
      if (jwtToken) {
        this.isAuthenticated = true;

        const headers = {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        };

        showUsers(headers).then((res: { data: any }) => {
          this.users = res.data;
          console.log(this.users);
        });
      } else {
        this.isAuthenticated = false;
      }
    },
  },
  getters: {
    name(): string {
      if (this.users.name && this.users.surname) {
        return `${this.users.name} ${this.users.surname}`;
      } else {
        return this.users.username;
      }
    },
    age(): number | string {
      if (this.users.dateOfBirth) {
        const birthdate = this.users.dateOfBirth;
        const birthYear = new Date(birthdate).getFullYear();
        const currentYear = new Date().getFullYear();

        return currentYear - birthYear;
      } else {
        return "Age";
      }
    },
    country(): string {
      if (this.users.country) {
        return this.users.country;
      } else {
        return "Country";
      }
    },
    city(): string {
      if (this.users.city) {
        return this.users.city;
      } else {
        return "City";
      }
    },
    adress(): string {
      if (this.users.adress) {
        return this.users.adress;
      } else {
        return "Adress";
      }
    },
    id(): number | string {
      if (this.users.id) {
        return this.users.id;
      } else {
        return "";
      }
    },
    img(): string {
      if (this.users.img) {
        return this.users.img.name;
      } else {
        return "";
      }
    },
  },
});
