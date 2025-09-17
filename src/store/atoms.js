import axios from "axios";
import { atom } from "jotai";
const api = "https://687f2e50efe65e520088a330.mockapi.io/menu"

export const usersAtom = atom([])
export const getUsersAtom = atom(null, async (get, set) => {
    try {
        let { data } = await axios.get(api)
        set(usersAtom, data)
    } catch (error) {
        console.error(error)
    }
})
export const addUserAtom = atom(null, async (get, set, newUser) => {
    try {
        await axios.post(api, newUser)
        set(getUsersAtom)
    } catch (error) {
        console.error(error)
    }
})
export const removeUserAtom = atom(null, async (get, set, id) => {
    try {
        await axios.delete(`${api}/${id}`)
        set(getUsersAtom)
    } catch (error) {
        console.error(error)
    }
})
export const updateUserAtom = atom(null, async (get, set, updated) => {
    try {
        await axios.put(`${api}/${updated.id}`, updated)
        set(getUsersAtom)
    } catch (error) {
        console.error(error)
    }
})
export const checkedUserAtom = atom(null, async (get, set, elem) => {
    elem.status = !elem.status
    try {
        await axios.put(`${api}/${elem.id}`, elem)
        set(getUsersAtom)
    } catch (error) {
        console.error(error)
    }
})