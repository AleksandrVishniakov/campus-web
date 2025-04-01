import APIError from "../APIError"

interface UserCredentials {
    id: number,
    token: string
}

interface User {
    id: number,
    login: string,
    role: string,
}

class AuthAPI {
    private readonly host: string

    constructor(host: string) {
        this.host = host
    }

    public async login(
        login: string, password: string
    ) {
        const url = this.host + "/login"

        const response = await fetch(
            url, {
                method: "POST",
                body: JSON.stringify({
                    login: login,
                    password: password
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )

        if (!response.ok) {
            const apiError = await response.json() as APIError

            throw new Error(apiError.code.toString())
        }

        const credentials = await response.json() as UserCredentials

        window.localStorage.setItem("token", credentials.token)
        window.localStorage.setItem("id", credentials.id.toString())

        return credentials
    }

    public async register(
        login: string, password: string
    ) {
        const url = this.host + "/register"

        const response = await fetch(
            url, {
                method: "POST",
                body: JSON.stringify({
                    login: login,
                    password: password
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )

        if (!response.ok) {
            const apiError = await response.json() as APIError

            throw new Error(apiError.code.toString())
        }

        const credentials = await response.json() as UserCredentials

        window.localStorage.setItem("token", credentials.token)
        window.localStorage.setItem("id", credentials.id.toString())

        return credentials
    }

    public async getUser(id: number) {
        const url = this.host + "/user/" + id

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

        return await response.json() as User
    }

    public async changeRole(id: number, role: string) {
        const url = this.host + "/change-role"

        const response = await fetch(
            url, 
            {
                method: "PUT",
                body: JSON.stringify({
                    userID: id,
                    newRole: role,
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

export default AuthAPI;