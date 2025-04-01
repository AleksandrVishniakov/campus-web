import APIError from "../APIError"

interface UserMetadata {
    userID: number
    name: string
    surname: string
    class: string
    room: string
    updatedAt: Date
}

class ProfileAPI {
    private readonly host: string

    constructor(host: string) {
        this.host = host
    }

    public async getProfile(id: number) {
        const url = this.host + "/profile/" + id

        const response = await fetch(
            url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                },
            }
        )

        if (!response.ok) {
            const apiError = await response.json() as APIError

            throw new Error(apiError.code.toString())
        }

        return await response.json() as UserMetadata
    }

    public async updateProfile(name: string, surname: string, classN: string, room: string) {
        const url = this.host + "/profile"

        const response = await fetch(
            url, {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    surname: surname,
                    class: classN,
                    room: room
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                },
            }
        )

        if (!response.ok) {
            const apiError = await response.json() as APIError

            throw new Error(apiError.code.toString())
        }
    }
}

export default ProfileAPI;