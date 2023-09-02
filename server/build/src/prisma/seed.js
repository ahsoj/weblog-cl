"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const userData = [
    {
        username: 'joshua',
        email: 'josh@gmail.com',
        passwordHash: '$2b$10$EAvEQZrzPDLE82FDqPTiSOlf40DphIPMC4g.dIRFVBTviShkFcwI6',
        post: {
            create: [
                {
                    title: 'b_log pblish announcment',
                    slug: 'b_log-pblish-announcment',
                    content: 'We are happy to announce the launch of our new blog!',
                    published: true,
                },
            ],
        },
    },
];
async function main() {
    console.log('Start seeding ...');
    userData.map(async (data) => {
        const user = await prisma_1.prisma.user.create({
            data,
        });
        console.log('Created user with id', user.id);
    });
    console.log('Seeding finished.');
}
main()
    .catch((err) => {
    console.log(err);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map