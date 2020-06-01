export const getIsTokenExpired = (): boolean => {
    let jwtExpiry = localStorage.getItem("jwt_expiry");
    if (jwtExpiry) {
        const expiry = new Date(jwtExpiry);
        const now = new Date(Date.now());
        if (expiry < now) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}