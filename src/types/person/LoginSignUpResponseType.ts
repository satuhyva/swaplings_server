export type LoginSignUpResponseType = {
    code: string,
    success: boolean,
    message: string,
    username?: string,
    facebookName?: string,
    jwtToken?: string
}