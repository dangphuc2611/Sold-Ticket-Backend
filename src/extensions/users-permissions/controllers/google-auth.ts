import { OAuth2Client } from 'google-auth-library'

// Dùng OAuth2Client của Google để xác thực id_token
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export default {
    async callback(ctx) {
        const { id_token } = ctx.request.body

        if (!id_token) return ctx.badRequest('Thiếu id_token')

        // ✅ 1. Xác thực id_token bằng Google
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()
        const email = payload?.email
        const username = payload?.name

        if (!email) return ctx.badRequest('Token không hợp lệ')

        // ✅ 2. Tìm người dùng theo email
        let user = await strapi.entityService.findMany('plugin::users-permissions.user', {
            filters: { email },
        })

        // ✅ 3. Nếu chưa có user → tạo mới
        if (!user.length) {
            user = await strapi.entityService.create('plugin::users-permissions.user', {
                data: {
                    username,
                    email,
                    provider: 'google',
                    confirmed: true,
                },
            })
        } else {
            user = user[0]
        }

        // ✅ 4. Tạo JWT từ user.id
        const token = strapi.plugins['users-permissions'].services.jwt.issue({
            id: user.id,
        })

        // ✅ 5. Trả JWT về cho Frontend
        ctx.send({
            jwt: token,
            user,
        })
    }
}
