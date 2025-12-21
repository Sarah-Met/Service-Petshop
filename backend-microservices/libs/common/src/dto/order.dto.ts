import { IsNotEmpty, IsString, IsNumber, IsArray, IsObject, IsEnum, Min, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateOrderDto {
    @IsOptional()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsArray()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch (e) {
                return [];
            }
        }
        return value;
    })
    products: Array<{ product: string; quantity: number; price: number }>;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => Number(value))
    totalAmount: number;

    @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    @IsOptional()
    status?: string;

    @IsOptional()
    @IsObject()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }
        return value;
    })
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };

    @IsOptional()
    adoptionAgreement?: any;

    @IsOptional()
    @IsString()
    adoptionSignature?: string;
}

export class UpdateOrderDto {
    @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    status?: string;
}
