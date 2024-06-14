import swaggerAutogenous from 'swagger-autogen';
import path from 'path';

const doc = {
    info: {
        title: '寵愛天然 | 六角學院北11組專題',
        description: `我們的創立理念是基於對寵物健康的極端關注和對食品純淨性的不懈追求。
    `
    },
    // schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
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
                title: '鮮嫩雞胸肉鮮食罐頭',
                subtitle: '新鮮雞胸肉，符合人食等級，富含高品質蛋白質，提供毛孩維持健康體愛所需的重要營養素。',
                category: ['fresh', 'dog'],
                otherInfo: [{ infoName: '產地', infoValue: '台灣' }],
                star: 4,
                imageGallery: [
                    {
                        imgUrl: 'https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        altText: '狗鮮食'
                    }
                ],
                createdAt: '2024-05-21T12:17:20.660Z',
                updatedAt: '2024-05-21T12:17:20.660Z'
            }
        },
        SingleProductResponses: {
            status: 'success',
            data: {
                title: '貓肉泥主食罐',
                subtitle: '新鮮雞胸肉，符合人食等級，富含高品質蛋白質，提供毛孩維持健康體愛所需的重要營養素',
                description:
                    ' <p>\n          24h 快速出貨:fire:<br>\n          :smiley_cat:貓肉泥主食罐:dog:<br>\n          嚴選人食等級肉品，100%純天然健康、絕無添加！<br>!!照護毛孩健康是我們的本份:sparkling_heart:我們的包裝簡約卻充滿溫暖，用心經營每一個細節，只為了將成本降至最低，讓品質卻提升至最高，將這份愛與呵護，完美呈現在毛孩的每一餐中:heart_eyes:\n          TW台灣加工廠直售，我們與您攜手守護毛孩的健康，原料、加工到包裝一條龍作業全都在台灣在地生產製作:fire:\n          如有相關問題歡迎聊聊~小編竭盡所能&盡快的回覆🫶️※ 小編回覆時間為9:00~小編愛睏為止:relieved:\n          ⚠近期繁多包裹詐騙⚠突如其來的貨到付款...等手法!!請家長們再三確認訂單系統通知:fire:為了預防詐騙:fire:建議使用信用卡付款、轉帳付款。\n        </p>',
                star: 4.1,
                category: ['fresh', 'cat'],
                otherInfo: [
                    {
                        infoName: '產地',
                        infoValue: '台灣'
                    }
                ],
                imageGallery: [
                    {
                        imgUrl: 'https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        altText: '貓鮮食'
                    },
                    {
                        imgUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/12726835984140-c4068191-7291-456e-b6b4-792140c83051.png',
                        altText: '狗鮮食'
                    }
                ],
                productSpecList: [
                    {
                        _id: '',
                        productId: '',
                        weight: 80,
                        price: 90,
                        inStock: 50,
                        onlineStatus: false,
                        createdAt: '2024-06-03T16:11:55.598Z',
                        updatedAt: '2024-06-03T16:11:55.598Z'
                    },
                    {
                        _id: '',
                        productId: '',
                        weight: 56,
                        price: 59,
                        inStock: 150,
                        onlineStatus: false,
                        createdAt: '2024-06-03T16:11:56.046Z',
                        updatedAt: '2024-06-03T16:11:56.046Z'
                    }
                ]
            },
            message: '取得單一商品資料成功'
        }
    }
};

const outputFile = `${path.resolve()}/develop/swagger_output.json`;

swaggerAutogenous(outputFile, ['src/app/index.ts'], doc);
