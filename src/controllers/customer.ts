import { RequestHandler } from 'express';
import { AppError } from '@/service/AppError';
import CustomerModel from '@/models/customer';

export const getInfo: RequestHandler = async (req, res, next) => {
    try {
        const result = await CustomerModel.findOne({
            _id: req.params.id,
        });
        if (!result) {
            next(AppError('消費者資訊不存在', 404));
            return;
        }
        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

export const updateInfo: RequestHandler = async (req, res, next) => {
    try {
        const {
            customerName,
            phone,
            image,
            recipientName,
            deliveryAddress: {
                country,
                county,
                district,
                address
            }
        } = req.body;

        const result = await CustomerModel.findByIdAndUpdate(
            req.params.id,
            {
                customerName,
                phone,
                image,
                recipientName,
                deliveryAddress: {
                    country,
                    county,
                    district,
                    address
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!result) {
            next(AppError('消費者資訊不存在', 404));
            return;
        }
        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

