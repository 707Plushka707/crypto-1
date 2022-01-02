import axios from 'axios';

const endpoint = 'http://localhost:5000/';

const url_users = endpoint+'users'
export const getUsers = async () => await fetch(`${url_users}`)
export const getProfileData = async (username) => await fetch(`${url_users}/profileData/`+username)
export const getTradeHistory = async (data) => await fetch(`${url_users}/tradeHistory/${data.id}/${data.limit}`)

