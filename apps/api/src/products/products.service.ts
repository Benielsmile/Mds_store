import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DB_CONNECTION } from '../db/db.module';
import { products } from '../db/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db.select().from(products).orderBy(desc(products.createdAt));
  }

  async findOne(id: string) {
    const [product] = await this.db.select().from(products).where(eq(products.id, id));
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const [newProduct] = await this.db
      .insert(products)
      .values(createProductDto)
      .returning();
    return newProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const [updatedProduct] = await this.db
      .update(products)
      .set({ ...updateProductDto, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
      
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return updatedProduct;
  }

  async remove(id: string) {
    const [deletedProduct] = await this.db
      .update(products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    if (!deletedProduct) {
      throw new NotFoundException('Product not found');
    }
    return deletedProduct;
  }
}
