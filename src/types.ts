import firebase from "firebase/app";

export type AuthState = {
        status: "loading" | "in" | "out"
        user?: firebase.User
        token?: string
}

export type HuntModel = {
        id?:number,
        user_id?:string,
        timestamp?:string,
        title:string,
        link: string,
        price: number,
        currency:string,
        tags?: Array<string>
        upvotes?: Array<string>,
        downvotes?:Array<string>,
        views?:number,
        upvoteCount?:number,
        downvoteCount?: number
}

export type ProfileModel = {
        id: string,
        handle: string,
        firstName: string;
        lastName: string;
        bio: string;
        profilePicUrl: string;
}