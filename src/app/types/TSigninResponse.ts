export type TSigninResponse = {
    message: string;
    user: {
        accessToken: string;
        mail: string;
        refreshToken: string;
    };
};
