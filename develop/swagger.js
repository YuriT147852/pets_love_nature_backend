import swaggerAutogenous from 'swagger-autogen';
import path from 'path';

const doc = {
    info: {
        title: '寵愛天然 | 六角學院北11組專題',
        description: `我們的創立理念是基於對寵物健康的極端關注和對食品純淨性的不懈追求。
    `
    },
    schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'authorization',
            description: '請加上 API Token'
        }
    },
    // 參考 : https://swagger-autogen.github.io/docs/swagger-2/schemas-and-definitions
    definitions: {
        ProductResponses: {
            _id: '661a9a9fa892ea2a81234567',
            weight: 30,
            price: 200,
            inStock: 50,
            onlineStatus: false,
            onlineDate: '',
            product: {
                _id: '661a9a9fa892ea2a833a1009',
                title: '鮮嫩雞胸肉鮮食罐頭',
                subtitle: '新鮮雞胸肉，符合人食等級，富含高品質蛋白質，提供毛孩維持健康體愛所需的重要營養素。',
                description: '...',
                category: ['fresh', 'dog'],
                otherInfo: [{ infoName: '產地', infoValue: '台灣' }],
                star: 0,
                imageGallery: [
                    {
                        imgUrl: 'https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        altText: '狗鮮食'
                    }
                ]
            }
        }
    }
};

const outputFile = `${path.resolve()}/develop/swagger_output.json`;

swaggerAutogenous(outputFile, ['src/app/index.ts'], doc);
