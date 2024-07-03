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
            productId: {
                _id: '661a9a9fa892ea2a81234567',
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
                _id: '66487aba27b3916f705679f0',
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
        },
        CommentResponses: {
            status: 'success',
            data: {
                _id: '666ea32b2949401b22e54e4e',
                customerId: {
                    _id: '663f12237a6dabc6203875f4',
                    email: 'd22495521@gmail.com',
                    customerName: '王大頭3',
                    image: ''
                },
                productId: {
                    _id: '665a9f704a2dbe2bbf936563',
                    title: '鮮嫩牛腿排凍乾',
                    subtitle: '新鮮牛腿排，符合人食等級，富含高品質蛋白質，提供毛孩維持健康體愛所需的重要營養素',
                    star: 4.3,
                    category: ['dry', 'fresh', 'cat', 'dog'],
                    otherInfo: [
                        {
                            infoName: '產地',
                            infoValue: '台灣'
                        }
                    ],
                    imageGallery: [
                        {
                            _id: '666eaed89a628a2a0740e90b',
                            imgUrl: 'https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                            altText: '狗鮮食'
                        }
                    ]
                },
                orderId: {
                    _id: '666e983c8e72d5cb153de579'
                },
                star: 4.2,
                comment: '貓吃的非常喜歡',
                createdAt: '2024-06-16T08:32:43.194Z',
                updatedAt: '2024-06-16T08:32:43.194Z'
            },
            message: '取得評論成功'
        },
        UnCommentOrderIdResponses: {
            status: 'success',
            data: ['668176a23c47cbc8a1898562', '6683ef96086208014e849b69', '66840468086208014e849efd'],
            message: '取得待評價的訂單列表'
        },
        UnCommentResponses: {
            status: 'success',
            data: [
                {
                    _id: '66840468086208014e849efd',
                    userId: '6649fb0de0b4e28164a7f81c',
                    orderProductList: [
                        {
                            productId: '6683fd4d086208014e849e05',
                            price: 450,
                            quantity: 1,
                            productTitle: '魚油鮭魚肉凍乾',
                            coverImg:
                                'https://storage.googleapis.com/petstore-3a2e1.appspot.com/images/8644a486-8bc1-4336-9f26-035addd44742.jpeg?GoogleAccessId=firebase-adminsdk-p5zjq%40petstore-3a2e1.iam.gserviceaccount.com&Expires=16756675200&Signature=G1cifxtelACf1A5kBPqaLfqViyD19FWTo2q3yVj7aca3pC85eGPESQgn99ObSZoK4WJ8WHDKhlkIYcQkN2jd4aXiLiVWjvJCogmAa5IIKfsUQzP%2FkOZI21QdGB1mW0Gg4ebPP%2B%2BlYNjNa9qjYoz3GFFTfTB88Xdp9Imi5ZwHPsXwES9m%2FPniwTWUdSjG37c9bU6CVFHIUMD95Dx5d6vGoQOAYYs%2BSBibbJzqzLjw09aQVouxjdDadLWgNk1PC1kXRI%2FOkn2PYCdSpqBIe2c71N0RmXpbpVlai%2BUipNoEMXVuFq8nBb0WjoW15kYfJrdwyYHd2Jim4al6mJGJzw2i%2Fw%3D%3D',
                            weight: 100
                        }
                    ],
                    orderStatus: 4,
                    orderAmount: 450,
                    deliveryUserName: 'KKK',
                    deliveryAddress: {
                        country: 'Taiwan',
                        county: '新北市',
                        district: '中和區',
                        address: '中山路一段'
                    },
                    note: '',
                    deliveryEmail: 's9654003@gmail.com',
                    deliveryPhone: '0987654321',
                    orderDate: '2024-07-02T13:45:12.333Z',
                    createdAt: '2024-07-02T13:45:12.334Z',
                    updatedAt: '2024-07-02T13:49:28.267Z'
                }
            ],
            message: '成功取得評價'
        },
        CustomerCommentResponses: {
            status: 'success',
            data: [
                {
                    _id: '666ea32b2949401b22e54e4e',
                    customerId: {
                        _id: '663f12237a6dabc6203875f4',
                        email: 'd22495521@gmail.com',
                        customerName: '王大頭3',
                        image: ''
                    },
                    productId: {
                        _id: '665a9f704a2dbe2bbf936563',
                        title: '鮮嫩牛腿排凍乾',
                        subtitle: '新鮮牛腿排，符合人食等級，富含高品質蛋白質，提供毛孩維持健康體愛所需的重要營養素',
                        star: 4.3,
                        category: ['dry', 'fresh', 'cat', 'dog'],
                        otherInfo: [
                            {
                                infoName: '產地',
                                infoValue: '台灣'
                            }
                        ],
                        imageGallery: [
                            {
                                _id: '668513875dbf70f6e9d02c36',
                                imgUrl: 'https://images.unsplash.com/photo-1571873735645-1ae72b963024?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                altText: '狗鮮食'
                            },
                            {
                                _id: '668513875dbf70f6e9d02c37',
                                imgUrl: 'https://images.unsplash.com/photo-1565826357292-caba11217a55?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                altText: '狗鮮食'
                            }
                        ]
                    },
                    orderId: '666e983c8e72d5cb153de579',
                    star: 4.2,
                    comment: '貓吃的非常喜歡',
                    createdAt: '2024-06-16T08:32:43.194Z',
                    updatedAt: '2024-06-16T08:32:43.194Z'
                }
            ],
            message: '成功取得該顧客的歷史商品評價，顧客ID: 663f12237a6dabc6203875f4'
        },
        OrderCommentResponses: {
            status: 'success',
            data: [
                {
                    _id: '667fbc72c720331d70353553',
                    customerId: {
                        _id: '667d8798c3874ad847ad6e76',
                        email: 'yurit630@gmail.com',
                        customerName: 'Wenfish Tseng',
                        image: 'https://lh3.googleusercontent.com/a/ACg8ocILpy2TrC3KJFAaRe9bN2p0zbfXcJxuv4BmFZQaeink3HDofTNJ=s96-c'
                    },
                    productId: {
                        _id: '664c90d099eb1ab9b3c4f643',
                        title: '鮮嫩雞胸肉凍乾',
                        subtitle: '新鮮雞胸肉，符合人食等級，富含高品質蛋白質，提供毛孩維持健康體愛所需的重要營養素',
                        imageGallery: [
                            {
                                imgUrl: 'https://images.unsplash.com/photo-1565826357186-e0f4f2b26232?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                altText: '狗鮮食',
                                _id: '66802a98cdbe545bcbbb4b2b'
                            },
                            {
                                imgUrl: 'https://storage.googleapis.com/petstore-3a2e1.appspot.com/images/b4ef6503-8ea3-455f-b0bb-e3431dc9d31c.jpg?GoogleAccessId=firebase-adminsdk-p5zjq%40petstore-3a2e1.iam.gserviceaccount.com&Expires=16756675200&Signature=GOPtHn8x7Cmof4Lc0DxN2fgofe2oQr3JcJSWHOMZqsjfehIHFhHBQSuKv8lATbOn0Nc4o8O43wHUeqoOMnoZ7CA2zx1cCpiwZA2C0EOFdFjRC8UmRhbKd65hxQLDAf8K8ApdUi9HwSm4KcMRfRsUhKhL4%2BkhzavWufvK%2F0a2Ew9RW69fZGq0ri53M0OLZLFC1TE7IPQUsEULe%2B5fHVAkezZwpPNsKxCoLj3f6Rvlzkov7ZU98usfiPh3IftBzuzWKGFzY3OpW23Q5JEoeT2dtc2esiIHnhXJHT4cLU7yCU3iVA%2FsckIpIJu6M6aRCuDZz7xgwE1mqFI8j5PM38prWA%3D%3D',
                                altText: 'abc',
                                _id: '66802a98cdbe545bcbbb4b2c'
                            }
                        ]
                    },
                    orderId: '667d87cec3874ad847ad6e96',
                    star: 4.8,
                    comment: '貓吃的非常非常喜歡,絕對會回購!!!',
                    createdAt: '2024-06-29T07:49:06.422Z',
                    updatedAt: '2024-06-29T07:49:06.422Z'
                }
            ],
            message: '成功取得該顧客的歷史商品評價，訂單ID: 667d87cec3874ad847ad6e96'
        },
        ProductListResponses: [
            {
                _id: '66487aba27b3916f705679f0',
                productId: {
                    _id: '663f18d3fc11d10c288dc062',
                    title: '鮮嫩雞胸肉鮮食罐頭',
                    subtitle: '新鮮雞胸肉，符合人食等級，富含高品質蛋白質，提供毛孩維持健康體愛所需的重要營養素。',
                    description:
                        '  <p>\n          24h 快速出貨:fire:<br>\n          :smiley_cat:寵物鮮食鮮嫩雞胸肉鮮食罐頭:dog:<br>\n          嚴選人食等級肉品，100%純天然健康、絕無添加！<br>!!照護毛孩健康是我們的本份:sparkling_heart:我們的包裝簡約卻充滿溫暖，用心經營每一個細節，只為了將成本降至最低，讓品質卻提升至最高，將這份愛與呵護，完美呈現在毛孩的每一餐中:heart_eyes:\n          TW台灣加工廠直售，我們與您攜手守護毛孩的健康，原料、加工到包裝一條龍作業全都在台灣在地生產製作:fire:\n          如有相關問題歡迎聊聊~小編竭盡所能&盡快的回覆🫶️※ 小編回覆時間為9:00~小編愛睏為止:relieved:\n          ⚠近期繁多包裹詐騙⚠突如其來的貨到付款...等手法!!請家長們再三確認訂單系統通知:fire:為了預防詐騙:fire:建議使用信用卡付款、轉帳付款。\n        </p>',
                    category: ['fresh', 'dog'],
                    productNumber: 'A0001',
                    otherInfo: [
                        {
                            infoName: '產地',
                            infoValue: '台灣'
                        }
                    ],
                    star: 4,
                    imageGallery: [
                        {
                            _id: '666fa979c434628aa73a42f2',
                            imgUrl: 'https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                            altText: '狗鮮食'
                        }
                    ]
                },
                productNumber: 'B0001',
                weight: 76,
                price: 100,
                inStock: 10,
                onlineStatus: false,
                createdAt: '2024-05-11T08:44:02.095Z',
                updatedAt: '2024-05-11T08:44:02.095Z'
            }
        ]
    }
};

const outputFile = `${path.resolve()}/develop/swagger_output.json`;

swaggerAutogenous(outputFile, ['src/app/index.ts'], doc);
