export default [
    {
        method: 'POST',
        path: '/auth/google/callback',
        handler: 'google-auth.callback',
        config: {
            auth: false, // Không yêu cầu JWT trước khi truy cập
        },
    },
]
