const API_BASE_URL = "http://localhost:3000";
import { Router } from "@vaadin/router";
// import { UPSERT } from "sequelize/types/lib/query-types";
const state = {
  data: {
    token: "",
    fullName: "",
    email: "",
    password: "",
    userId: "",
    lat: false,
    lng: false,
    editPetId: "",
    reportPetName: "",
    reportPetLocation: "",
    reportPetLat: false,
    reportPetLng: false,
    reportPetPicture: "",
    myReportedPets: [],
    logged: false,
    lastAddress: "",
  },
  listeners: [],
  init() {
    const localData = localStorage.getItem("data");
    if (localData !== null) {
      let cs = JSON.parse(localData);
      if (cs.logged) {
        state.setState(cs);
      } else {
        cs = this.data;
        state.setState(cs);
      }
    }
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("data", JSON.stringify(state.getState()));
    console.log("el state cambio", this.data);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  unsubscribe() {
    this.listeners.pop();
  },
  go(address: string) {
    const cs = this.getState();
    if (cs.logged) {
      Router.go(address);
    } else {
      cs.lastAddress = address;
      Router.go("/email-page");
    }
  },
  async foundPet() {
    const cs = state.getState();
    const data = await fetch(API_BASE_URL + "/pet/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: cs.editPetId,
        found: true,
      }),
    });
    const response = await data.json();
    console.log(response);
    return response;
  },

  async unlinkPet() {
    const cs = state.getState();
    const data = await fetch(API_BASE_URL + "/pet/" + cs.editPetId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    return response;
  },
  async checkEmail() {
    const cs = state.getState();
    const data = await fetch(API_BASE_URL + "/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: cs.email,
      }),
    });
    const response = await data.json();
    return response;
  },
  async auth() {
    const cs = state.getState();

    const data = await fetch(API_BASE_URL + "/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: cs.email,
        fullName: cs.fullName,
        password: cs.password,
      }),
    });
    const response = await data.json();
    if (response == "ok") {
      return true;
    }
  },
  async profileUpdate() {
    const cs = state.getState();
    const data = await fetch(API_BASE_URL + "/profileupdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: cs.userId,
        fullname: cs.fullName,
        password: cs.password,
      }),
    });
    const response = await data.json();
    if (response == "updated") {
      return true;
    } else {
      return false;
    }
  },
  async getAuthToken() {
    const cs = state.getState();

    const data = await fetch(API_BASE_URL + "/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: cs.email,
        password: cs.password,
      }),
    });
    const response = await data.json();
    if (response == "wrong email or password") {
      return false;
    }
    cs.token = response;
    state.setState(cs);
    const token = cs.token;
    const dataMe = await fetch(API_BASE_URL + "/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Beaarer " + token,
      },
    });
    const responseMe = await dataMe.json();
    if (responseMe == "Not auth") {
      return false;
    } else {
      cs.fullName = responseMe.fullName;
      cs.userId = responseMe.id;
      cs.logged = true;
      state.setState(cs);
      return true;
    }
  },
  closeSession() {
    let cs = this.getState();
    (cs = {
      token: "",
      fullName: "",
      email: "",
      password: "",
      userId: "",
      lat: false,
      lng: false,
      reportPetName: "",
      reportPetLocation: "",
      reportPetLat: false,
      reportPetLng: false,
      reportPetPicture: "",
      myReportedPets: [],
      logged: false,
      lastAddress: "",
    }),
      state.setState(cs);
  },
  async getNearLostPets() {
    const cs = state.getState;
    const data = await fetch(API_BASE_URL + "/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    //enviar location y recibir pets mediante busqueda en algolia
  },
  async getMyReportedPets() {
    const cs = state.getState();
    console.log("/pets/" + cs.userId);
    const response = await fetch(API_BASE_URL + "/pets/" + cs.userId);
    const data = await response.json();
    return data;
  },
  removeListeners() {
    this.listeners = [];
  },
  async reportLostPet() {
    const cs = state.getState();
    const data = await fetch(API_BASE_URL + "/report-lost-pet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: cs.userId,
        nombre: cs.reportPetName,
        picture: cs.reportPetPicture,
        lat: cs.reportPetLat,
        lng: cs.reportPetLng,
        location: cs.reportPetLocation,
      }),
    });
    const response = await data.json();
    if (response == "Pet already created") {
      return false;
    } else if (response == "Pet created") {
      return true;
    }
  },
  async updateLostPet() {
    const cs = state.getState();
    const data = await fetch(API_BASE_URL + "/pet", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: cs.editPetId,
        nombre: cs.reportPetName,
        picture: cs.reportPetPicture,
        lat: cs.reportPetLat,
        lng: cs.reportPetLng,
        location: cs.reportPetLocation,
      }),
    });
    const response = await data.json();
    return response;
  },
};

export { state };
