export type LoginSignUpResponseType = {
    code: string,
    success: boolean,
    message: string,
    id: string | undefined,
    username?: string,
    facebookName?: string,
    jwtToken?: string
}