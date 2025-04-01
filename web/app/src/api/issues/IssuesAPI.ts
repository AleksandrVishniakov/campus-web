import APIError from "../APIError"

interface IssueWithUserMetadata {
    id: number,
    authorID: number,
    title: string,
    description: string,
    isClosed: boolean,
    createdAt: Date,
    closedAt: Date,
    name: string,
    surname: string,
    class: string,
    room: string,
}

interface IssueMetadata {
    id: number
    authorID: number
    title: string
    description: string
    imagesLinks: Array<string>
    isClosed: boolean
    createdAt: Date
    closedAt: Date | null
}

interface Comment {
    id: number
    authorID: number
    issueID: number
    content: string
    createdAt: Date
}

interface Comments {
    comments: Comment[]
}

class IssuesAPI {
    private readonly host: string

    constructor(host: string) {
        this.host = host
    }

    public async filterIssues(
        authorID: number | null,
        isClosed: boolean | null,
        query: string | null,
        rooms: Array<string> | null,
        classes: Array<string> | null,
        startTime: Date | null,
        endTime: Date | null,
    ) {
        const url = this.host + "/issues"

        const response = await fetch(
            url, {
            method: "POST",
            body: JSON.stringify({
                authorID: authorID,
                isClosed: isClosed,
                query: query,
                rooms: rooms,
                classes: classes,
                timeInterval: !startTime || !endTime ? null : { start: startTime, end: endTime }
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

        return await response.json() as IssueWithUserMetadata[]
    }

    public async getIssue(id: number) {
        const url = this.host + "/issue/" + id

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

        const data = await response.json() as IssueMetadata

        if (data.imagesLinks) {
            for (let i = 0; i < data.imagesLinks.length; i++) {
                let s = data.imagesLinks[i]
                s = s.replace("seaweedfs-volume", "http://" + document.location.hostname)
                data.imagesLinks[i] = s
            }
        }


        return data
    }

    public async markAsClosed(id: number) {
        const url = this.host + "/issue/" + id + "/close"

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
    }

    public async getComments(id: number) {
        const url = this.host + "/issue/" + id + "/comments"

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

        const c = await response.json() as Comments

        return c.comments
    }

    public async newComment(id: number, content: string) {
        const url = this.host + "/issue/" + id + "/comment"

        const response = await fetch(
            url, {
            method: "POST",
            body: JSON.stringify({
                content: content
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

    public async updateComment(issueID: number, commentID: number, content: string) {
        const url = this.host + "/issue/" + issueID + "/comment/" + commentID

        const response = await fetch(
            url, {
            method: "PUT",
            body: JSON.stringify({
                content: content
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

    public async deleteComment(issueID: number, commentID: number) {
        const url = this.host + "/issue/" + issueID + "/comment/" + commentID

        const response = await fetch(
            url, {
            method: "DELETE",
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

    public async createIssue(
        title: string,
        description: string,
        images: File[]
    ) {
        const url = this.host + "/issue"
        const formData = new FormData()

        formData.append('title', title)
        formData.append('description', description)
        
        images.forEach(file => {
            formData.append('images', file)
        })

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
            },
        })

        if (!response.ok) {
            const apiError = await response.json() as APIError
            throw new Error(apiError.code.toString())
        }
    }
}

export default IssuesAPI;