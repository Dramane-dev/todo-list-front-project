export type TSigninResponse = {
    message: string;
    user: {
        accessToken: string;
        isAuthenticated: boolean;
        mail: string;
        refreshToken: string;
    };
};
