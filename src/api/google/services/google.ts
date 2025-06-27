export default {
    async verifyAndLogin(accessToken) {
        // 1. Gửi token đến Google
        const res = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
        if (!res.ok) throw new Error('Google token verification failed');

        const googleUser: { email?: string; verified_email?: boolean } = await res.json();
        const { email, verified_email } = googleUser;

        if (!email || !verified_email) {
            throw new Error('Email is not verified by Google');
        }

        // 2. Tìm người dùng trong Strapi
        console.log('Google login email:', email);
        const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { email },
        });

        let user = existingUser;

        // 3. Nếu chưa có → tạo tài khoản mới
        if (!user) {
            user = await strapi.plugins['users-permissions'].services.user.add({
                email,
                username: email.split('@')[0],
                provider: 'google',
                confirmed: true,
            });
        }

        // 4. Tạo JWT
        const jwt = strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id });

        return { jwt, user };
    },
};
