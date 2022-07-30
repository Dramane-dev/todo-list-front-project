export type TSigninResponse = {
    message: string;
    user: {
        email: string;
        accessToken: string;
        isAuthenticated: boolean;
        refreshToken: string;
    };
};
