export const isAuthenticated = () => {
    try {
        return !!localStorage.getItem('accessToken');
    } catch (e) {
        return false;
    }
};

export default isAuthenticated;
